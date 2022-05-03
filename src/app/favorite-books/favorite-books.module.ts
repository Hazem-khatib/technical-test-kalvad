import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteBooksComponent } from './favorite-books.component';
import { FavoriteBooksRoutingModule } from './favorite-books-routing.module';
import { NewFavoriteBookComponent } from './partials/new-favorite-book/new-favorite-book.component';
import { FavoriteBooksTableComponent } from './partials/favorite-books-table/favorite-books-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    FavoriteBooksComponent,
    NewFavoriteBookComponent,
    FavoriteBooksTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FavoriteBooksRoutingModule,
    // Materials
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    SharedModule,
  ],
})
export class FavoriteBooksModule {}
