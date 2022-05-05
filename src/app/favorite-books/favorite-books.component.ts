import { Component } from '@angular/core';
@Component({
  selector: 'app-favorite-books',
  templateUrl: './favorite-books.component.html',
})
export class FavoriteBooksComponent {
  showNewBookForm = false;

  onShowAddFormHandler(e: boolean) {
    this.showNewBookForm = e;
  }
}
