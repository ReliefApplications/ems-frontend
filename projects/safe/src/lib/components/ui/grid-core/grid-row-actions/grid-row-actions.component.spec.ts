import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGridRowActionsComponent } from './grid-row-actions.component';

describe('SafeGridRowActionsComponent', () => {
  let component: SafeGridRowActionsComponent;
  let fixture: ComponentFixture<SafeGridRowActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeGridRowActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridRowActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
