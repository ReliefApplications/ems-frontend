import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDisplayComponent } from './tab-display.component';

describe('TabDisplayComponent', () => {
  let component: TabDisplayComponent;
  let fixture: ComponentFixture<TabDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
