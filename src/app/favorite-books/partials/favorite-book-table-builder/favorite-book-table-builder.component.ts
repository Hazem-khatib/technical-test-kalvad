import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BooksList } from '../../model/book-list';
interface ListBuilderState {
  showNewBook: boolean;
  showListName: boolean;
}
@Component({
  selector: 'app-favorite-book-table-builder',
  templateUrl: './favorite-book-table-builder.component.html',
})
export class FavoriteBookTableBuilderComponent {
  @Output() closeListBuilderEvent = new EventEmitter<boolean>();
  listNameForm = this.formBuilder.group({
    name: [null, [Validators.required, this.validateBookName()]],
  });
  state$ = new BehaviorSubject<Partial<ListBuilderState>>({
    showNewBook: false,
    showListName: true,
  });
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar
  ) {}
  onSubmitHandler() {
    if (this.listNameForm.invalid) return;
    const storageBooksList: BooksList | null =
      this.localStorageService.get('favoriteBooks');
    this.localStorageService.set('favoriteBooks', {
      ...(storageBooksList ?? {}),
      [this.listNameForm.value.name]: [],
    });
    this.state$.next({
      ...this.state$.value,
      showNewBook: true,
      showListName: false,
    });
    this.snackBar.open('List added successfully', 'Dismiss', {
      duration: 2000,
    });
  }
  onCancelHandler(e: any) {
    this.onCloseBuilderHandler(true);
  }
  validateBookName(): { [key: string]: any } | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const storageBooksList: BooksList | null =
        this.localStorageService.get('favoriteBooks');
      if (control.value && storageBooksList) {
        const exists = Object.prototype.hasOwnProperty.call(
          storageBooksList,
          control.value.toString()
        );
        if (exists) return { bookListNameExists: true };
      }
      return null;
    };
  }
  onCloseBuilderHandler(e: boolean) {
    this.closeListBuilderEvent.emit(e);
  }
}
