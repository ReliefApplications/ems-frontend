import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetAutomationComponent } from './widget-automation.component';

describe('WidgetAutomationComponent', () => {
  let component: WidgetAutomationComponent;
  let fixture: ComponentFixture<WidgetAutomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetAutomationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
