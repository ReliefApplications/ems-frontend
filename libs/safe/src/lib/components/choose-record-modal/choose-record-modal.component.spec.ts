import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { SafeChooseRecordModalComponent } from './choose-record-modal.component';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from './graphql/queries';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeChooseRecordModalComponent', () => {
  let component: SafeChooseRecordModalComponent;
  let fixture: ComponentFixture<SafeChooseRecordModalComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        QueryBuilderService,
        UntypedFormBuilder,
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { targetForm: {} } },
      ],
      imports: [
        TranslateModule.forRoot(),
        DialogCdkModule,
        ApolloTestingModule,
        SafeChooseRecordModalComponent,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeChooseRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_QUERY_TYPES);

    op.flush({
      data: {
        __schema: {
          types: [],
          queryType: { name: '', kind: '', fields: [] },
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
