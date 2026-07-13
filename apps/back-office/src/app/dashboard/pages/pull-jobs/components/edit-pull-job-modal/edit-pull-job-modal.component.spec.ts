import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { EditPullJobModalComponent } from './edit-pull-job-modal.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  TooltipModule,
  ButtonModule,
  ExpansionPanelModule,
  SelectMenuModule,
  FormWrapperModule,
  TextareaModule,
  ChipModule,
  GraphQLSelectModule,
  IconModule,
  DialogModule,
} from '@oort-front/ui';
import {
  ReadableCronModule,
  CronExpressionControlModule,
} from '@oort-front/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditPullJobModalComponent', () => {
  let component: EditPullJobModalComponent;
  let fixture: ComponentFixture<EditPullJobModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TooltipModule,
        ButtonModule,
        ExpansionPanelModule,
        SelectMenuModule,
        FormWrapperModule,
        TextareaModule,
        ChipModule,
        GraphQLSelectModule,
        IconModule,
        EditPullJobModalComponent,
        ApolloTestingModule,
        DialogModule,
        ReadableCronModule,
        CronExpressionControlModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        TranslateService,
        {
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: {},
        },
        {
          provide: Dialog,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPullJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
