import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { EditBookDialogComponent } from './partials/favorite-books-table/partials/edit-book-dialog/edit-book-dialog.component';
import { FavoriteBooksComponent } from './favorite-books.component';
import { FavoriteBooksRoutingModule } from './favorite-books-routing.module';
import { NewFavoriteBookComponent } from './partials/new-favorite-book/new-favorite-book.component';
import { FavoriteBooksTableComponent } from './partials/favorite-books-table/favorite-books-table.component';
import { FavoriteBookTableBuilderComponent } from './partials/favorite-book-table-builder/favorite-book-table-builder.component';
@NgModule({
  declarations: [
    FavoriteBooksComponent,
    NewFavoriteBookComponent,
    FavoriteBooksTableComponent,
    EditBookDialogComponent,
    FavoriteBookTableBuilderComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FavoriteBooksRoutingModule,
    // Material
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    DragDropModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatCardModule,
    MatSelectModule,
    //App modules
    SharedModule,
  ],
})
export class FavoriteBooksModule {}
