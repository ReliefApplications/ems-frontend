import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTypeDisplayerComponent } from './date-type-displayer.component';

describe('DateTypeDisplayerComponent', () => {
  let component: DateTypeDisplayerComponent;
  let fixture: ComponentFixture<DateTypeDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTypeDisplayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateTypeDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
