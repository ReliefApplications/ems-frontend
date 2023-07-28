import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetFieldsPermissionsModalComponent } from './set-fields-permissions-modal.component';

describe('SetFieldsPermissionsModalComponent', () => {
  let component: SetFieldsPermissionsModalComponent;
  let fixture: ComponentFixture<SetFieldsPermissionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetFieldsPermissionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetFieldsPermissionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
