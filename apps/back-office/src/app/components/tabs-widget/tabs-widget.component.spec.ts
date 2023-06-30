import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeTabsWidgetComponent } from './tabs-widget.component';

describe('TabsComponent', () => {
  let component: SafeTabsWidgetComponent;
  let fixture: ComponentFixture<SafeTabsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeTabsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeTabsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
