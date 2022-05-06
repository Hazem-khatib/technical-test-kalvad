import { Book } from '../../../../model/book-list';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-book-dialog',
  templateUrl: './edit-book-dialog.component.html',
})
export class EditBookDialogComponent implements OnInit {
  editBookForm?: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Book>
  ) {}

  ngOnInit(): void {
    this.editBookForm = this.formBuilder.group({
      title: [this.data.title, [Validators.required]],
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
}
