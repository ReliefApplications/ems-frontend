import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeContentChoiceComponent } from './content-choice.component';

describe('ContentChoiceComponent', () => {
  let component: SafeContentChoiceComponent;
  let fixture: ComponentFixture<SafeContentChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeContentChoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeContentChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
