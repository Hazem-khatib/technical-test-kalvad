import { LocalStorageService } from './../../../../../shared/services/local-storage.service';
import { Book, BooksList } from '../../../../model/book-list';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-book-dialog',
  templateUrl: './edit-book-dialog.component.html',
})
export class EditBookDialogComponent implements OnInit {
  editBookForm?: FormGroup;
  constructor(
    private localStorageService: LocalStorageService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Book>
  ) {}

  ngOnInit(): void {
    this.editBookForm = this.formBuilder.group({
      title: [this.data.title, [Validators.required, this.validateBookName()]],
      author: [this.data.author, Validators.required],
      year: [
        this.data.year,
        [
          Validators.required,
          Validators.max(new Date().getFullYear()),
          Validators.pattern('^[0-9]{4,4}$'),
        ],
      ],
    });
  }
  onEditHandler() {
    if (this.editBookForm?.invalid) return;
    this.dialogRef.close(this.editBookForm?.value);
  }

  onCloseHandler() {
    this.dialogRef.close();
  }
  validateBookName(): { [key: string]: any } | null {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const storageBookLists: BooksList | null =
        this.localStorageService.get('favoriteBooks');
      if (
        control.value &&
        storageBookLists &&
        this.data.listName &&
        storageBookLists[this.data.listName]
      ) {
        const index = storageBookLists[this.data.listName].findIndex(
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
