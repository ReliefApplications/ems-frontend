import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:libs/ui/src/lib/date/date-range/date-range.component.spec.ts
import { DateRangeComponent } from './date-range.component';

describe('DateRangeComponent', () => {
  let component: DateRangeComponent;
  let fixture: ComponentFixture<DateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateRangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeComponent);
========
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
>>>>>>>> 611c012158bafba51858bbd1ed02f203d6343032:libs/ui/src/lib/dialog/dialog.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
