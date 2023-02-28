import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTabComponent } from './display-tab.component';

describe('DisplayTabComponent', () => {
  let component: DisplayTabComponent;
  let fixture: ComponentFixture<DisplayTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
