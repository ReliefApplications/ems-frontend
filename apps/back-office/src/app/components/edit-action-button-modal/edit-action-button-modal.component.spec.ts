import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActionButtonModalComponent } from './edit-action-button-modal.component';

describe('EditActionButtonModalComponent', () => {
  let component: EditActionButtonModalComponent;
  let fixture: ComponentFixture<EditActionButtonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActionButtonModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditActionButtonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
