import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BooksList } from './model/book-list';
import { LocalStorageService } from '../shared/services/local-storage.service';
interface FavoriteBooksState {
  listName: string | null;
  showNewList: boolean;
  showLists: boolean;
  showNewBook: boolean;
  error: boolean;
}
@Component({
  selector: 'app-favorite-books',
  templateUrl: './favorite-books.component.html',
})
export class FavoriteBooksComponent implements OnInit {
  state$ = new BehaviorSubject<FavoriteBooksState>({
    showNewList: false,
    showLists: false,
    showNewBook: false,
    error: false,
    listName: null,
  });

  storageLists$ = new BehaviorSubject<BooksList | undefined>(undefined);
  constructor(private localStorageService: LocalStorageService) {}
  ngOnInit(): void {
    this.updateData();
  }

  onNewListHandler(e: boolean) {
    this.state$.next({
      ...this.state$.value,
      showNewList: e,
      showLists: !e,
    });
  }
  onCloseListBuilder(e: boolean) {
    this.state$.next({
      ...this.state$.value,
      showNewList: !e,
      showLists: e,
    });
    this.updateData();
  }
  onOpenNewBookHandler(e: boolean, listName: string) {
    this.state$.next({
      ...this.state$.value,
      listName,
      showLists: !e,
      showNewBook: e,
    });
  }
  onCloseNewBookHandler(e: boolean) {
    this.state$.next({
      ...this.state$.value,
      showLists: e,
      showNewBook: !e,
    });
    this.updateData();
  }
  updateData() {
    this.localStorageService
      .getSubject('favoriteBooks')
      .subscribe({
        next: (data) => {
          this.storageLists$.next(<BooksList>data);
          this.state$.next({
            ...this.state$.value,
            showLists: true,
          });
        },
        error: () => {
          this.state$.next({
            ...this.state$.value,
            error: true,
          });
        },
      })
      .unsubscribe();
  }
}
