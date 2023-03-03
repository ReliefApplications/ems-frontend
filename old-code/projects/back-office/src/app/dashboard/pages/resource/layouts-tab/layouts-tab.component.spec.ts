import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutsTabComponent } from './layouts-tab.component';

describe('LayoutsTabComponent', () => {
  let component: LayoutsTabComponent;
  let fixture: ComponentFixture<LayoutsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutsTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
