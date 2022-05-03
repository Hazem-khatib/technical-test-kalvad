import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './services/local-storage.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  declarations: [],
  imports: [CommonModule, FontAwesomeModule],
  exports: [FontAwesomeModule],
  providers: [LocalStorageService],
})
export class SharedModule {}
