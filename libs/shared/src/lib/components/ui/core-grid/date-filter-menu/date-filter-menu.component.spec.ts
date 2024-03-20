import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFilterMenuComponent } from './date-filter-menu.component';

describe('DateFilterMenuComponent', () => {
  let component: DateFilterMenuComponent;
  let fixture: ComponentFixture<DateFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateFilterMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
