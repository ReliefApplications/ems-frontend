import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsWidgetComponent } from './tabs-widget.component';

describe('TabsWidgetComponent', () => {
  let component: TabsWidgetComponent;
  let fixture: ComponentFixture<TabsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
