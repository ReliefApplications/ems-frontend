import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ConfigDisplayGridFieldsModalComponent } from './config-display-grid-fields-modal.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from './graphql/queries';

describe('ConfigDisplayGridFieldsModalComponent', () => {
  let component: ConfigDisplayGridFieldsModalComponent;
  let fixture: ComponentFixture<ConfigDisplayGridFieldsModalComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        { provide: DIALOG_DATA, useValue: { types: [] } },
        TranslateService,
        QueryBuilderService,
      ],
      imports: [
        ConfigDisplayGridFieldsModalComponent,
        TranslateModule.forRoot(),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDisplayGridFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_QUERY_TYPES);

    op.flush({
      data: {
        __schema: {
          types: [],
          queryType: {
            name: '',
            kind: '',
            fields: [],
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
