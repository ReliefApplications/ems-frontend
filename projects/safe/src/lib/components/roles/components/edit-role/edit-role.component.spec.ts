import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SafeEditRoleComponent } from './edit-role.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import {
  GET_CHANNELS,
  GET_PERMISSIONS,
} from 'projects/safe/src/lib/graphql/queries';

describe('SafeEditRoleComponent', () => {
  let component: SafeEditRoleComponent;
  let fixture: ComponentFixture<SafeEditRoleComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        TranslateService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { role: { title: '' } } },
      ],
      declarations: [SafeEditRoleComponent],
      imports: [
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op1 = controller.expectOne(GET_PERMISSIONS);

    op1.flush({
      data: {},
    });

    const op2 = controller.expectOne(GET_CHANNELS);

    op2.flush({
      data: {
        channels: [],
      },
    });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
