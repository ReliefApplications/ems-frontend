import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { TabFieldsComponent } from './tab-fields.component';
import { EditorService } from '../../../services/editor/editor.service';
import { HtmlParserService } from '../../../services/html-parser/html-parser.service';

describe('TabFieldsComponent', () => {
  let component: TabFieldsComponent;
  let fixture: ComponentFixture<TabFieldsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        TranslateService,
        {
          provide: EditorService,
          useValue: { url: '', language: undefined },
        },
        {
          provide: HtmlParserService,
          useValue: { getDataKeys: () => [], getCalcKeys: () => [] },
        },
      ],
      declarations: [TabFieldsComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters available fields in the selected form order', () => {
    component.form = new UntypedFormArray([]);
    component.fields = [
      { name: 'first', type: { kind: 'SCALAR' } },
      { name: 'second', type: { kind: 'SCALAR' } },
      { name: 'outside', type: { kind: 'SCALAR' } },
    ];
    component.layoutForms = [
      { id: 'form-id', name: 'Form', fields: ['second', 'first'] },
    ];

    component.onFormChange('form-id');

    expect(component.availableFields.map((field) => field.name)).toEqual([
      'second',
      'first',
    ]);
  });

  it('moves an invalid nested field back to the available fields when a form filter is active', () => {
    component.form = new UntypedFormArray([]);
    component.fields = [
      { name: 'first', type: { kind: 'SCALAR' } },
      {
        name: 'nested',
        type: { kind: 'LIST', ofType: { name: 'Nested' } },
      },
    ];
    component.layoutForms = [
      { id: 'form-id', name: 'Form', fields: ['nested', 'first'] },
    ];
    component.onFormChange('form-id');
    // Adds the nested field, which is invalid until sub-fields are selected
    component.addAllFields();
    expect(component.form.at(0).invalid).toBe(true);

    component.drop({
      previousContainer: { data: component.selectedFields },
      container: { data: component.availableFields },
      previousIndex: 0,
      currentIndex: 0,
    } as any);

    expect(component.form.getRawValue().map((field) => field.name)).toEqual([
      'first',
    ]);
    expect(component.availableFields.map((field) => field.name)).toEqual([
      'nested',
    ]);
  });

  it('adds filtered fields in their displayed order and removes all selected fields', () => {
    component.form = new UntypedFormArray([]);
    component.fields = [
      { name: 'first', type: { kind: 'SCALAR' } },
      { name: 'second', type: { kind: 'SCALAR' } },
    ];
    component.layoutForms = [
      { id: 'form-id', name: 'Form', fields: ['second', 'first'] },
    ];
    component.onFormChange('form-id');

    component.addAllFields();

    expect(component.form.getRawValue().map((field) => field.name)).toEqual([
      'second',
      'first',
    ]);
    expect(component.availableFields).toEqual([]);

    component.removeAllFields();

    expect(component.form.length).toBe(0);
    expect(component.availableFields.map((field) => field.name)).toEqual([
      'second',
      'first',
    ]);
  });
});
