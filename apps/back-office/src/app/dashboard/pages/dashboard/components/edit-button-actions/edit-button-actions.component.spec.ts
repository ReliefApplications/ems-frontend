import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditButtonActionsComponent } from './edit-button-actions.component';

describe('EditButtonActionComponent', () => {
  let component: EditButtonActionsComponent;
  let fixture: ComponentFixture<EditButtonActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditButtonActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditButtonActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
