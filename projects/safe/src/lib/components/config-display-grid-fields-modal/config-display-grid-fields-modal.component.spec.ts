import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigDisplayGridFieldsModalComponent } from './config-display-grid-fields-modal.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { QueryBuilderService } from '../../services/query-builder.service';
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
        FormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { types: [] } },
        TranslateService,
        QueryBuilderService,
      ],
      declarations: [ConfigDisplayGridFieldsModalComponent],
      imports: [
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
    fixture = TestBed.createComponent(ConfigDisplayGridFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_QUERY_TYPES);

    op.flush({
      data: {
        __schema: {
          types: [],
          queryType: {
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
