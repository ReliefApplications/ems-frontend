import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeWidgetChoiceComponent } from './widget-choice.component';

describe('SafeWidgetChoiceComponent', () => {
  let component: SafeWidgetChoiceComponent;
  let fixture: ComponentFixture<SafeWidgetChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeWidgetChoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeWidgetChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
