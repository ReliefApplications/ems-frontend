import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { ReadOnlyFieldsModalComponent } from './read-only-fields-modal.component';

describe('ReadOnlyFieldsModalComponent', () => {
  let component: ReadOnlyFieldsModalComponent;
  let fixture: ComponentFixture<ReadOnlyFieldsModalComponent>;
  let closeSpy: jest.Mock;

  /** Query fields, mixing scalar / structural / object fields, as returned by the query builder service */
  const fields = [
    { name: 'id', type: { kind: 'SCALAR' } },
    { name: 'firstName', type: { kind: 'SCALAR' } },
    { name: 'lastName', type: { kind: 'SCALAR' } },
    { name: 'createdBy', type: { kind: 'OBJECT', fields: [] } },
  ];

  beforeEach(async () => {
    closeSpy = jest.fn();

    await TestBed.configureTestingModule({
      imports: [
        ReadOnlyFieldsModalComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        {
          provide: DialogRef,
          useValue: {
            close: closeSpy,
            // Used internally by the ui-dialog wrapper component
            updateSize: jest.fn(),
            addPanelClass: jest.fn(),
            removePanelClass: jest.fn(),
          },
        },
        {
          provide: DIALOG_DATA,
          useValue: { fields, readOnlyFields: ['lastName'] },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadOnlyFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only expose scalar, non-structural fields, splitting already read-only ones into the "read-only" column', () => {
    expect(component.availableFields.map((f) => f.name)).toEqual(['firstName']);
    expect(component.selectedFields.map((f) => f.name)).toEqual(['lastName']);

    // 'id' is a structural field and 'createdBy' is not scalar: neither should be selectable
    const allListedFields = [
      ...component.availableFields,
      ...component.selectedFields,
    ].map((f) => f.name);
    expect(allListedFields).not.toContain('id');
    expect(allListedFields).not.toContain('createdBy');
  });

  it('should close the dialog without a value when cancelled', () => {
    component.onClose();
    expect(closeSpy).toHaveBeenCalledWith();
  });

  it('should close the dialog with the selected field names when saved', () => {
    component.selectedFields = [
      { name: 'lastName', label: 'Last name' },
      { name: 'firstName', label: 'First name' },
    ];

    component.onSave();

    expect(closeSpy).toHaveBeenCalledWith(['lastName', 'firstName']);
  });
});
