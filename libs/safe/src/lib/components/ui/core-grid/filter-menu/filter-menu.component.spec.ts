import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { SafeGridFilterMenuComponent } from './filter-menu.component';

describe('SafeGridFilterMenuComponent', () => {
  let component: SafeGridFilterMenuComponent;
  let fixture: ComponentFixture<SafeGridFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder],
      declarations: [SafeGridFilterMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridFilterMenuComponent);
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
