import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeRecordModalComponent } from './record-modal.component';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_RECORD_BY_ID } from './graphql/queries';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { AppAbility } from '../../services/auth/auth.service';

describe('SafeRecordModalComponent', () => {
  let component: SafeRecordModalComponent;
  let fixture: ComponentFixture<SafeRecordModalComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
        AppAbility,
      ],
      imports: [
        DialogCdkModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
        SafeRecordModalComponent,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_RECORD_BY_ID);

    op.flush({
      data: {
        record: {
          id: '',
          data: '',
          createdAt: '',
          modifiedAt: '',
          createdBy: {
            name: '',
          },
          modifiedBy: {
            name: '',
          },
          form: {
            id: '',
            structure: '',
            permissions: {
              recordsUnicity: '',
            },
            fields: [],
            metadata: {
              name: '',
              automated: '',
              canSee: '',
              canUpdate: '',
            },
          },
        },
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
