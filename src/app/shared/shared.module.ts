import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './services/local-storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    //Material
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [MatDialogModule, MatIconModule],
  providers: [LocalStorageService],
})
export class SharedModule {}
