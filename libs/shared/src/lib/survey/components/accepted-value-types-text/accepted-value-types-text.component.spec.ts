import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcceptedValueTypesTextComponent } from './accepted-value-types-text.component';

describe('AcceptedValueTypesTextComponent', () => {
  let component: AcceptedValueTypesTextComponent;
  let fixture: ComponentFixture<AcceptedValueTypesTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedValueTypesTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptedValueTypesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
