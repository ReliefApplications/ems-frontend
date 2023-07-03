import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabButtonsComponent } from './tab-buttons.component';

describe('TabButtonsComponent', () => {
  let component: TabButtonsComponent;
  let fixture: ComponentFixture<TabButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabButtonsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
