import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditButtonActionModalComponent } from './edit-button-action-modal.component';

describe('EditButtonActionModalComponent', () => {
  let component: EditButtonActionModalComponent;
  let fixture: ComponentFixture<EditButtonActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditButtonActionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditButtonActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
