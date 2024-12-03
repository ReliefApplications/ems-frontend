import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButtonsComponent } from './action-buttons.component';

describe('ActionButtonsComponent', () => {
  let component: ActionButtonsComponent;
  let fixture: ComponentFixture<ActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
