import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangeComponent } from './date-range.component';
import { DateRangeModule } from './date-range.module';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('DateRangeComponent', () => {
  let component: DateRangeComponent;
  let fixture: ComponentFixture<DateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateRangeComponent],
      imports: [DateRangeModule, TranslateTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
