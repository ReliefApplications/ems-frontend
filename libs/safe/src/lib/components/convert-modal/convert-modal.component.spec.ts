import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeConvertModalComponent } from './convert-modal.component';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_RECORD_DETAILS } from './graphql/queries';

describe('SafeConvertModalComponent', () => {
  let component: SafeConvertModalComponent;
  let fixture: ComponentFixture<SafeConvertModalComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      imports: [
        SafeConvertModalComponent,
        DialogCdkModule,
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeConvertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_RECORD_DETAILS);

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
          form: {
            id: '',
            name: '',
            createdAt: '',
            structure: '',
            fields: '',
            core: '',
            resource: {
              id: '',
              name: '',
              forms: [
                {
                  id: '',
                  name: '',
                  structure: '',
                  fields: '',
                  core: '',
                },
              ],
            },
          },
          versions: [
            {
              id: '',
              createdAt: '',
              data: '',
              createdBy: {
                name: '',
              },
            },
          ],
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
