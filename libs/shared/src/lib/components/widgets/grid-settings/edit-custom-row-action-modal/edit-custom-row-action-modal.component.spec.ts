import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomRowActionModalComponent } from './edit-custom-row-action-modal.component';

describe('EditCustomRowActionModalComponent', () => {
  let component: EditCustomRowActionModalComponent;
  let fixture: ComponentFixture<EditCustomRowActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCustomRowActionModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCustomRowActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
