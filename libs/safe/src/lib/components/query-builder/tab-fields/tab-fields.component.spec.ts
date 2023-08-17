import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { SafeTabFieldsComponent } from './tab-fields.component';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { AlertModule, ButtonModule, FormWrapperModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';

describe('SafeTabFieldsComponent', () => {
  let component: SafeTabFieldsComponent;
  let fixture: ComponentFixture<SafeTabFieldsComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        TranslateService,
        QueryBuilderService,
        {
          provide: 'environment',
          useValue: { frontOfficeUri: 'https://.' },
        },
      ],
      declarations: [SafeTabFieldsComponent],
      imports: [
        AlertModule,
        FormsModule,
        ReactiveFormsModule,
        FormWrapperModule,
        ButtonModule,
        DragDropModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
