import { Book, BooksList } from '../../model/book-list';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import {
  ChangeDetectorRef,
  Component,
  Input,
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
  @Input() listName?: string;
  @ViewChild('table') table?: MatTable<Partial<Book>>;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  displayedColumns: string[] = [
    'order',
    'title',
    'year',
    'authorName',
    'action',
  ];
  booksLength = 0;
  private subs = new SubSink();
  private storageLists?: BooksList;
  private defaultPageSizeOptions: number[] = [5, 10];
  pageSizeOptions?: number[];
  dataSource: MatTableDataSource<Partial<Book>> | undefined =
    new MatTableDataSource<Partial<Book>>();

  favoriteBooksList$ = new BehaviorSubject<Partial<Book>[] | undefined>(
    undefined
  );
  state$ = new BehaviorSubject<Partial<BooksListState>>({
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
    if (!this.listName) return;
    this.subs.sink = this.localStorageService
      .getSubject('favoriteBooks')
      .subscribe({
        next: (data) => {
          if (!this.listName) return;
          this.storageLists = data as BooksList;
          this.favoriteBooksList$.next(this.storageLists[this.listName]);
          this.dataSource = new MatTableDataSource<Partial<Book>>(
            this.favoriteBooksList$.value?.map((item, index) => {
              return {
                ...item,
                order: index,
              };
            })
          );
          // update paginator page size options to be possible to see all books in one page and sort after GRUD operations
          if (this.dataSource && this.favoriteBooksList$.value) {
            this.cdr.detectChanges();
            this.booksLength = this.favoriteBooksList$.value.length;
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
            'Unable to get books of ' +
              this.listName +
              ' list, please try again later',
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
    if (this.dataSource.data && this.listName)
      this.localStorageService.set('favoriteBooks', {
        ...this.storageLists,
        [this.listName]: this.dataSource.data,
      });
  }
  onDeleteBookHandler(book: Partial<Book>) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'Are you sure that you want to delete this book:  ' +
          book.title +
          ' ?',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && this.listName && this.storageLists) {
        this.state$.next({
          ...this.state$.value,
          deleting: true,
        });
        const storageBooks: Book[] | null = this.storageLists[this.listName];
        const filteredBooks = storageBooks?.filter(
          (item) => item.id !== book.id
        );
        this.localStorageService.set('favoriteBooks', {
          ...this.storageLists,
          [this.listName]: filteredBooks,
        });
        this.state$.next({
          ...this.state$.value,
          deleting: false,
        });
      }
    });
  }
  onEditBookHandler(book: Partial<Book>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.data = book;

    const dialogRef = this.dialog.open(EditBookDialogComponent, dialogConfig);
    this.subs.sink = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && this.listName && this.storageLists) {
        this.state$.next({
          ...this.state$.value,
          editing: true,
        });

        const updatedBooks = this.storageLists[this.listName]?.map((item) => {
          if (item.id === book.id) {
            return {
              ...item,
              ...dialogResult,
            };
          } else return item;
        });
        this.localStorageService.set('favoriteBooks', {
          ...this.storageLists,
          [this.listName]: updatedBooks,
        });
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
        message: 'Are you sure that you want to delete ' + this.listName + ' ?',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && this.storageLists && this.listName) {
        this.state$.next({
          ...this.state$.value,
          deleting: true,
        });
        delete this.storageLists[this.listName];
        this.localStorageService.set('favoriteBooks', this.storageLists);
        this.state$.next({
          ...this.state$.value,
          deleting: false,
        });
      }
    });
  }
  setPageSizeOptions() {
    this.pageSizeOptions = this.defaultPageSizeOptions;
    if (Math.max(...this.pageSizeOptions) < this.booksLength) {
      this.pageSizeOptions = [...this.pageSizeOptions, this.booksLength];
    }
  }
  onShowAddBookHandler(e: any) {}
}
