import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActionButtonsModalComponent } from './edit-action-buttons-modal.component';

describe('EditActionButtonComponent', () => {
  let component: EditActionButtonsModalComponent;
  let fixture: ComponentFixture<EditActionButtonsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActionButtonsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditActionButtonsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
