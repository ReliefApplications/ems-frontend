import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeExpandedWidgetComponent } from './expanded-widget.component';

describe('SafeExpandedWidgetComponent', () => {
  let component: SafeExpandedWidgetComponent;
  let fixture: ComponentFixture<SafeExpandedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeExpandedWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExpandedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
