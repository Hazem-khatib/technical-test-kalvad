import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Book } from '../../modals/book';
@Component({
  selector: 'app-new-favorite-book',
  templateUrl: './new-favorite-book.component.html',
})
export class NewFavoriteBookComponent {
  @Output() hideFormEvent = new EventEmitter<boolean>();
  addBookForm = this.formBuilder.group({
    title: [null, [Validators.required, this.validateBookName()]],
    author: [null, Validators.required],
    year: [1932, [Validators.required, Validators.pattern('^[0-9]{4,4}$')]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar
  ) {}
  onSubmitHandler() {
    if (this.addBookForm.invalid) return;

    const storageBooks: Book[] | null =
      this.localStorageService.get('favoriteBooks');
    this.localStorageService.set('favoriteBooks', [
      ...(storageBooks ?? []),
      {
        // add unique id for GRUD operations
        id: uuid(),
        ...this.addBookForm.value,
      },
    ]);
    this.hideFormEvent.emit(false);
    this.snackBar.open('Book added successfully', 'Dismiss', {
      duration: 2000,
    });
  }
  onCancelHandler(e: any) {
    e.preventDefault();
    this.hideFormEvent.emit(false);
  }
  validateBookName(): { [key: string]: any } | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const storageBooks: Book[] | null =
        this.localStorageService.get('favoriteBooks');
      if (control.value && storageBooks) {
        const index = storageBooks.findIndex(
          (book) =>
            book.title.toLocaleLowerCase().trim() ===
            control.value.toString().toLocaleLowerCase().trim()
        );
        if (index >= 0) return { bookTitleExists: true };
      }
      return null;
    };
  }
}
