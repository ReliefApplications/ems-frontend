import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SafeInviteUsersComponent } from './invite-users.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { UploadsModule } from '@progress/kendo-angular-upload';

describe('SafeInviteUsersComponent', () => {
  let component: SafeInviteUsersComponent;
  let fixture: ComponentFixture<SafeInviteUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        UntypedFormBuilder,
        {
          provide: DialogRef,
          useValue: { updateSize: jest.fn() },
        },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
      ],
      declarations: [SafeInviteUsersComponent],
      imports: [
        UploadsModule,
        ButtonModule,
        HttpClientModule,
        DialogModule,
        TranslateModule.forRoot(),
        GridModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeInviteUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
