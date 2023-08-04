import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRangeComponent } from './date-range.component';
import { DateRangeModule } from './date-range.module';
import { TranslateMockModule } from '@hetznercloud/ngx-translate-mock';

describe('DateRangeComponent', () => {
  let component: DateRangeComponent;
  let fixture: ComponentFixture<DateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateRangeComponent],
      imports: [DateRangeModule, TranslateMockModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
