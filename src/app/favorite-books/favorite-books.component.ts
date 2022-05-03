import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-favorite-books',
  templateUrl: './favorite-books.component.html',
})
export class FavoriteBooksComponent {
  //ICONS
  plusIcon = faPlus;

  showNewBookForm = false;

  onShowAddFormHandler(e: boolean) {
    this.showNewBookForm = e;
  }
}
