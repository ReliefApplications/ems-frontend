import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeAddRoleComponent } from './add-role.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule } from '@oort-front/ui';

describe('SafeAddRoleComponent', () => {
  let component: SafeAddRoleComponent;
  let fixture: ComponentFixture<SafeAddRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      declarations: [SafeAddRoleComponent],
      imports: [
        DialogModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAddRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
