import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabWidgetAutomationsComponent } from './tab-widget-automations.component';

describe('TabWidgetAutomationsComponent', () => {
  let component: TabWidgetAutomationsComponent;
  let fixture: ComponentFixture<TabWidgetAutomationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabWidgetAutomationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabWidgetAutomationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
