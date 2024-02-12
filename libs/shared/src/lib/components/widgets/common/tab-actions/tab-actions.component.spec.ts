import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabActionsComponent } from './tab-actions.component';

describe('TabActionsComponent', () => {
  let component: TabActionsComponent;
  let fixture: ComponentFixture<TabActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
