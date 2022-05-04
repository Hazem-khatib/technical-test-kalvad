import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  message?: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ConfirmDialogComponent
  ) {
    this.message = data.message ?? 'Are you sure?';
  }
  onConfirmHandler(): void {
    this.dialogRef.close(true);
  }

  onDismissHandler(): void {
    this.dialogRef.close(false);
  }
}
