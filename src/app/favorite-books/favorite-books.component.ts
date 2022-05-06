import { BehaviorSubject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksList } from './model/book-list';
import { SubSink } from 'subsink';
import { LocalStorageService } from '../shared/services/local-storage.service';
interface FavoriteBooksState {
  showNewList: boolean;
  showLists: boolean;
  showNewBook: boolean;
  error: boolean;
}
@Component({
  selector: 'app-favorite-books',
  templateUrl: './favorite-books.component.html',
})
export class FavoriteBooksComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  state$ = new BehaviorSubject<FavoriteBooksState>({
    showNewList: false,
    showLists: false,
    showNewBook: false,
    error: false,
  });

  storageLists$ = new BehaviorSubject<BooksList | undefined>(undefined);
  constructor(private localStorageService: LocalStorageService) {}
  ngOnInit(): void {
    this.subs.sink = this.localStorageService
      .getSubject('favoriteBooks')
      .subscribe({
        next: (data) => {
          this.storageLists$.next(<BooksList>data);
          if (
            this.storageLists$.value &&
            Object.keys(this.storageLists$.value)
          ) {
            this.state$.next({
              ...this.state$.value,
              showLists: true,
              showNewList: false,
              showNewBook: false,
            });
          } else {
            this.state$.next({
              ...this.state$.value,
              showNewList: true,
              showLists: false,
              showNewBook: false,
            });
          }
        },
        error: () => {
          this.state$.next({
            ...this.state$.value,
            error: true,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  onNewListHandler(e: boolean) {
    this.state$.next({
      ...this.state$.value,
      showNewList: true,
      showLists: false,
      showNewBook: false,
    });
  }
}
