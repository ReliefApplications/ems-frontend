import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotificationModalComponent } from './edit-notification-modal.component';

describe('EditNotificationModalComponent', () => {
  let component: EditNotificationModalComponent;
  let fixture: ComponentFixture<EditNotificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditNotificationModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
