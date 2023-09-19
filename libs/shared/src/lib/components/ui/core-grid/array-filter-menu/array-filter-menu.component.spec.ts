import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { ArrayFilterMenuComponent } from './array-filter-menu.component';

describe('ArrayFilterMenuComponent', () => {
  let component: ArrayFilterMenuComponent;
  let fixture: ComponentFixture<sharedArrayFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder],
      declarations: [ArrayFilterMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayFilterMenuComponent);
    component = fixture.componentInstance;
    component.filter = {
      logic: null,
      filters: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
