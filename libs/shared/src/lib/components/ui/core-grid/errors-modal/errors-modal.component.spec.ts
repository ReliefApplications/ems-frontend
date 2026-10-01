import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { EMPTY } from 'rxjs';
import {
  ErrorsModalComponent,
  ErrorsModalData,
} from './errors-modal.component';
import {
  TranslateModule,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

describe('ErrorsModalComponent', () => {
  let fixture: ComponentFixture<ErrorsModalComponent>;

  /**
   * Creates the modal with the given data.
   *
   * @param data data of the modal
   * @returns text displayed in the modal
   */
  const render = async (data: ErrorsModalData): Promise<string> => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: DialogRef,
          useValue: {
            close: jest.fn(),
            closed: EMPTY,
            addPanelClass: jest.fn(),
            removePanelClass: jest.fn(),
            updateSize: jest.fn(),
          },
        },
        { provide: DIALOG_DATA, useValue: data },
      ],
      imports: [
        ErrorsModalComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ErrorsModalComponent);
    fixture.detectChanges();
    return fixture.nativeElement.textContent;
  };

  it('shows the errors of a record, with the default texts', async () => {
    const text = await render({
      incrementalId: '2026-P1',
      errors: [{ question: 'org_code', errors: ['Already used'] }],
    });
    expect(fixture.componentInstance).toBeTruthy();
    expect(text).toContain('org_code');
    expect(text).toContain('Already used');
    expect(text).toContain('components.widget.grid.validation.title');
    expect(text).toContain('components.widget.grid.validation.help');
    expect(text).toContain('common.update');
  });

  it('uses the custom texts when provided', async () => {
    const text = await render({
      incrementalId: '',
      errors: [{ question: 'org_code', errors: ['Already used'] }],
      title: 'Possible duplicates',
      subtitle: 'Custom subtitle',
      help: 'Custom help',
      questionHeader: 'Row',
      confirmText: 'Save anyway',
    });
    expect(text).toContain('Possible duplicates');
    expect(text).toContain('Custom subtitle');
    expect(text).toContain('Custom help');
    expect(text).toContain('Row');
    expect(text).toContain('Save anyway');
    expect(text).not.toContain('components.widget.grid.validation.title');
    expect(text).not.toContain('common.update');
  });

  it('hides the help and the confirm button when asked to', async () => {
    const text = await render({
      incrementalId: '',
      errors: [{ question: 'Row 3', errors: ['Already used'] }],
      help: '',
      hideConfirm: true,
    });
    expect(text).not.toContain('components.widget.grid.validation.help');
    expect(text).not.toContain('common.update');
    expect(text).toContain('common.close');
  });
});
