import { FavoriteBooksComponent } from './favorite-books.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoriteBookTableBuilderComponent } from './partials/favorite-book-table-builder/favorite-book-table-builder.component';

const routes: Routes = [
  {
    path: '',
    component: FavoriteBooksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteBooksRoutingModule {}
