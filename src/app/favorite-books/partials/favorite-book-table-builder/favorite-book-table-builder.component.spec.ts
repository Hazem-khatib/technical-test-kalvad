import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBookTableBuilderComponent } from './favorite-book-table-builder.component';

describe('FavoriteBookTableBuilderComponent', () => {
  let component: FavoriteBookTableBuilderComponent;
  let fixture: ComponentFixture<FavoriteBookTableBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteBookTableBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteBookTableBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
