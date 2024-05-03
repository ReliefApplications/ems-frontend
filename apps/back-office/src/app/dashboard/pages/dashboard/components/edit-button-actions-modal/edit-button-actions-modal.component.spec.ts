import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditButtonActionsModalComponent } from './edit-button-actions-modal.component';

describe('EditButtonActionComponent', () => {
  let component: EditButtonActionsModalComponent;
  let fixture: ComponentFixture<EditButtonActionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditButtonActionsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditButtonActionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
