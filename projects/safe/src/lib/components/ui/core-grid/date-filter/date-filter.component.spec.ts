import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeDateFilterComponent } from './date-filter.component';

describe('SafeDateFilterComponent', () => {
  let component: SafeDateFilterComponent;
  let fixture: ComponentFixture<SafeDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeDateFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
