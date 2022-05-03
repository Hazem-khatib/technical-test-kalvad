import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { BehaviorSubject, of } from 'rxjs';
import { Book } from '../../modals/book';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EditBookDialogComponent } from './partials/edit-book-dialog/edit-book-dialog.component';

interface BooksListState {
  error: boolean;
  deleting: boolean;
}

@Component({
  selector: 'app-favorite-books-table',
  templateUrl: './favorite-books-table.component.html',
})
export class FavoriteBooksTableComponent implements OnInit, OnDestroy {
  @ViewChild('table') table?: MatTable<Partial<Book>>;
  private subs = new SubSink();

  displayedColumns: string[] = ['bookTitle', 'year', 'authorName', 'action'];

  dataSource: MatTableDataSource<Partial<Book>> | undefined =
    new MatTableDataSource<Partial<Book>>();

  favoriteBooks$ = new BehaviorSubject<Partial<Book>[] | undefined>(undefined);
  state$ = new BehaviorSubject<BooksListState>({
    error: false,
    deleting: false,
  });

  constructor(
    private snackBar: MatSnackBar,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.localStorageService
      .getSubject('favoriteBooks')
      .subscribe({
        next: (data) => {
          this.favoriteBooks$.next(data as Book[]);
          this.dataSource = new MatTableDataSource<Partial<Book>>(
            this.favoriteBooks$.value
          );
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
  onSortHandler(event: CdkDragDrop<Partial<Book>[]>) {
    if (!this.dataSource) return;
    moveItemInArray<Partial<Book>>(
      this.dataSource.data,
      event.previousIndex,
      event.currentIndex
    );

    if (this.dataSource.data)
      if (this.table) {
        this.table.renderRows();
      }
    // if (this.certifiedBuilder$.value) {
    //   const certifiedBuildersUpdates: { uid: string; order: number }[] =
    //     this.certifiedBuilder$.value
    //       .map((certified, index) => {
    //         if (!certified.uid) throw new Error('certified uid is missing');
    //         if (certified.order != index) {
    //           return {
    //             uid: certified.uid,
    //             order: index,
    //           };
    //         } else return null;
    //       })
    //       .filter(
    //         (certified): certified is { uid: string; order: number } =>
    //           certified !== null
    //       );

    //   this.certifiedBuilderService.batchUpdate(certifiedBuildersUpdates);
    // }
  }
  onDeleteBookHandler(book: Book) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message:
          'Are you sure that you want to delete this book:  ' +
          book.name +
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
    dialogConfig.position = {
      top: '0',
    };
    const dialogRef = this.dialog.open(EditBookDialogComponent, dialogConfig);
    this.subs.sink = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
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
      }
    });
  }
}
