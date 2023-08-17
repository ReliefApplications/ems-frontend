import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeRecordModalComponent } from './record-modal.component';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_RECORD_BY_ID } from './graphql/queries';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../../services/auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

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
        AppAbility,
      ],
      imports: [
        OAuthModule.forRoot(),
        DialogCdkModule,
        HttpClientModule,
        TranslateModule.forRoot(),
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
