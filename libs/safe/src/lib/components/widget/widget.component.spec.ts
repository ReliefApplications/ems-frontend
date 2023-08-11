import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeWidgetComponent } from './widget.component';

describe('SafeWidgetComponent', () => {
  let component: SafeWidgetComponent;
  let fixture: ComponentFixture<SafeWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeWidgetComponent);
    component = fixture.componentInstance;
    component.widget = {
      component: null,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
