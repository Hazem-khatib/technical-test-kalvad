import { Book } from '../../model/book';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { SubSink } from 'subsink';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EditBookDialogComponent } from './partials/edit-book-dialog/edit-book-dialog.component';
interface BooksListState {
  error: boolean;
  deleting: boolean;
  editing: boolean;
}

@Component({
  selector: 'app-favorite-books-table',
  templateUrl: './favorite-books-table.component.html',
})
export class FavoriteBooksTableComponent implements OnInit, OnDestroy {
  @ViewChild('table') table?: MatTable<Partial<Book>>;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  private subs = new SubSink();

  displayedColumns: string[] = [
    'order',
    'title',
    'year',
    'authorName',
    'action',
  ];
  booksLength = 0;
  private defaultPageSizeOptions: number[] = [5, 10];
  pageSizeOptions?: number[];
  dataSource: MatTableDataSource<Partial<Book>> | undefined =
    new MatTableDataSource<Partial<Book>>();

  favoriteBooks$ = new BehaviorSubject<Partial<Book>[] | undefined>(undefined);
  state$ = new BehaviorSubject<BooksListState>({
    error: false,
    deleting: false,
    editing: false,
  });

  constructor(
    private snackBar: MatSnackBar,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.localStorageService
      .getSubject('favoriteBooks')
      .subscribe({
        next: (data) => {
          this.favoriteBooks$.next(data as Book[]);
          this.dataSource = new MatTableDataSource<Partial<Book>>(
            this.favoriteBooks$.value?.map((item, index) => {
              return {
                ...item,
                order: index,
              };
            })
          );
          // update paginator page size and sort when GRUD operations
          if (this.dataSource && this.favoriteBooks$.value) {
            this.cdr.detectChanges();
            this.booksLength = this.favoriteBooks$.value.length;
            if (this.paginator) {
              this.setPageSizeOptions();
              this.dataSource.paginator = this.paginator;
            }
            if (this.sort) this.dataSource.sort = this.sort;
          }
        },
        error: () => {
          this.state$.next({
            ...this.state$.value,
            error: true,
          });
          this.snackBar.open(
            'Unable to get books list, please try again later',
            'Dismiss',
            {
              duration: -1,
            }
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  onDraggedEvent(event: CdkDragDrop<Partial<Book>[]>) {
    if (!this.dataSource) return;
    moveItemInArray<Partial<Book>>(
      this.dataSource.data,
      event.previousIndex,
      event.currentIndex
    );

    if (this.dataSource.data)
      if (this.table) {
        this.localStorageService.set('favoriteBooks', this.dataSource.data);
        this.table.renderRows();
      }
  }
  onDeleteBookHandler(book: Book) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'Are you sure that you want to delete this book:  ' +
          book.title +
          ' ?',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        const storageBooks: Book[] | null =
          this.localStorageService.get('favoriteBooks');
        const filteredBooks = storageBooks?.filter(
          (item) => item.id !== book.id
        );
        this.localStorageService.set('favoriteBooks', filteredBooks);
      }
    });
  }
  onEditBookHandler(book: Book) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = book;
    const dialogRef = this.dialog.open(EditBookDialogComponent, dialogConfig);
    this.subs.sink = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.state$.next({
          ...this.state$.value,
          editing: true,
        });
        const storageBooks: Book[] | null =
          this.localStorageService.get('favoriteBooks');
        const updatedBooks = storageBooks?.map((item) => {
          if (item.id === book.id) {
            return {
              ...item,
              ...dialogResult,
            };
          } else return item;
        });
        this.localStorageService.set('favoriteBooks', updatedBooks);
        this.state$.next({
          ...this.state$.value,
          editing: false,
        });
      }
    });
  }
  onDeleteListHandler() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure that you want to delete all books?  ',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.state$.next({
          ...this.state$.value,
          deleting: true,
        });
        this.localStorageService.remove('favoriteBooks');
        this.state$.next({
          ...this.state$.value,
          deleting: false,
        });
      }
    });
  }
  setPageSizeOptions() {
    this.pageSizeOptions = this.pageSizeOptions ?? this.defaultPageSizeOptions;
    if (Math.max(...this.pageSizeOptions) < this.booksLength) {
      this.pageSizeOptions = [...this.pageSizeOptions, this.booksLength];
    } else {
      // reset to default
      this.pageSizeOptions = this.defaultPageSizeOptions;
    }
  }
}
