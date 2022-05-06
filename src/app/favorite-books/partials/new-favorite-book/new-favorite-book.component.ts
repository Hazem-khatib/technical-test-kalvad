import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Book, BooksList } from '../../model/book-list';

@Component({
  selector: 'app-new-favorite-book',
  templateUrl: './new-favorite-book.component.html',
})
export class NewFavoriteBookComponent {
  @Output() hideNewBookEvent = new EventEmitter<boolean>();
  @Input() listName?: string;

  addBookForm = this.formBuilder.group({
    title: [null, [Validators.required, this.validateBookName()]],
    author: [null, Validators.required],
    year: [
      1932,
      [
        Validators.required,
        Validators.max(new Date().getFullYear()),
        Validators.pattern('^[0-9]{4,4}$'),
      ],
    ],
  });
  state$ = new BehaviorSubject<{ showForm: boolean }>({
    showForm: true,
  });
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar
  ) {}

  onSubmitHandler() {
    if (this.addBookForm.invalid) return;
    if (!this.listName) {
      this.snackBar.open(
        'You must create a list before adding books',
        'Dismiss',
        {
          duration: 2000,
        }
      );
      return;
    }

    const storageBooksLists: BooksList | null =
      this.localStorageService.get('favoriteBooks');
    const bookList = storageBooksLists ? storageBooksLists[this.listName] : [];
    this.localStorageService.set('favoriteBooks', {
      ...(storageBooksLists ?? {}),
      [this.listName]: [
        ...bookList,
        {
          // add unique id for GRUD operations
          id: uuid(),
          ...this.addBookForm.value,
        },
      ],
    });
    this.state$.next({
      showForm: false,
    });
    this.addBookForm.reset();
    this.snackBar.open('Book added successfully', 'Dismiss', {
      duration: 2000,
    });
  }

  onAddNewBookHandler() {
    this.state$.next({
      showForm: true,
    });
  }

  onCancelHandler(e: any) {
    e.preventDefault();
    this.hideNewBookEvent.emit(true);
  }

  validateBookName(): { [key: string]: any } | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const storageBookLists: BooksList | null =
        this.localStorageService.get('favoriteBooks');
      if (
        control.value &&
        storageBookLists &&
        this.listName &&
        storageBookLists[this.listName]
      ) {
        const index = storageBookLists[this.listName].findIndex(
          (book: Book) =>
            book.title.toLocaleLowerCase().trim() ===
            control.value.toString().toLocaleLowerCase().trim()
        );
        if (index >= 0) return { bookTitleExists: true };
      }
      return null;
    };
  }
}
