import { LocalStorageService } from './../../../../../shared/services/local-storage.service';
import { Book } from './../../../../modals/book';
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
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private dialogRef: MatDialogRef<EditBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Book>
  ) {}

  ngOnInit(): void {
    this.editBookForm = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      author: [this.data.author, Validators.required],
      year: [
        this.data.year,
        [Validators.required, Validators.pattern('^[0-9]{4,4}$')],
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
}
