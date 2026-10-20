import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { NgZone } from '@angular/core';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { SurveyModel } from 'survey-core';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { UNIQUENESS_ERROR_CODE } from '../../utils/validation-errors.util';
import { FormModalComponent } from './form-modal.component';

describe('FormModalComponent errors when saving a record', () => {
  const violations = [
    { question: 'Unique code', errors: ['A record with this code exists'] },
  ];

  it('keeps the form open, on the same page, when a uniqueness rule is violated on creation', async () => {
    const { component, dialog, dialogRef, snackBar, survey } = createComponent([
      {
        message: 'A record with this code exists',
        extensions: { code: UNIQUENESS_ERROR_CODE, violations },
      },
    ]);
    await component.ngOnInit();
    survey.setValue('title', 'Duplicate');
    survey.currentPageNo = 1;

    component.onComplete(survey);
    await flushPromises();

    // Nothing was saved: the modal is not closed, and the form is still
    // editable where the user left it
    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(survey.state).toBe('running');
    expect(survey.currentPageNo).toBe(1);
    expect(survey.getValue('title')).toBe('Duplicate');
    expect(component.saving).toBe(false);
    // The violated rules are listed, without the option to save anyway
    expect(snackBar.openSnackBar).not.toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledTimes(1);
    expect(dialog.open.mock.calls[0][1].data).toEqual({
      incrementalId: '',
      errors: [
        {
          question: '-',
          errors: ['A record with this code exists'],
          severity: 'error',
        },
      ],
      title: 'components.uniquenessRules.blocked.title',
      subtitle: 'components.uniquenessRules.blocked.subtitle',
      help: '',
      hideConfirm: true,
    });
    component.ngOnDestroy();
  });

  it('keeps the form open and notifies other errors', async () => {
    const { component, dialog, dialogRef, snackBar, survey } = createComponent([
      { message: 'Permission denied' },
    ]);
    await component.ngOnInit();
    survey.setValue('title', 'Some title');

    component.onComplete(survey);
    await flushPromises();

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(survey.state).toBe('running');
    expect(component.saving).toBe(false);
    expect(dialog.open).not.toHaveBeenCalled();
    expect(snackBar.openSnackBar).toHaveBeenCalledWith(
      'common.notifications.error',
      { error: true }
    );
    component.ngOnDestroy();
  });

  /**
   * Creates the modal for a new record, whose creation fails with the given
   * errors.
   *
   * @param errors errors returned by the creation mutation
   * @returns the modal component and its mocked dependencies
   */
  function createComponent(errors: Record<string, any>[]): {
    component: FormModalComponent;
    dialog: { open: jest.Mock };
    dialogRef: { close: jest.Mock };
    snackBar: { openSnackBar: jest.Mock };
    survey: SurveyModel;
  } {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: 'text', name: 'title' }] },
        { elements: [{ type: 'text', name: 'description' }] },
      ],
    });
    const apollo = {
      query: jest.fn().mockReturnValue(
        of({
          data: {
            form: {
              id: 'form-id',
              structure: '{}',
              fields: [],
              metadata: [],
            },
          },
        })
      ),
      mutate: jest.fn().mockReturnValue(of({ errors, data: null })),
    };
    const formBuilderService = {
      createSurvey: jest.fn().mockReturnValue(survey),
      addEventsCallBacksToSurvey: jest.fn(),
    } as unknown as FormBuilderService;
    const autoTranslateService = {
      suppressAutoTranslationWhile: (
        _survey: SurveyModel,
        callback: () => void
      ) => callback(),
    } as unknown as AutoTranslateService;
    const formHelpersService = {
      setEmptyQuestions: jest.fn(),
      createTemporaryRecords: jest.fn().mockResolvedValue(undefined),
      uploadFiles: jest.fn().mockResolvedValue(undefined),
    } as unknown as FormHelpersService;
    const dialog = { open: jest.fn().mockReturnValue({ closed: of(null) }) };
    const dialogRef = { close: jest.fn() };
    const snackBar = { openSnackBar: jest.fn() };
    const component = new FormModalComponent(
      { template: 'form-id', askForConfirm: false },
      dialog as unknown as Dialog,
      dialogRef as unknown as DialogRef<FormModalComponent>,
      apollo as unknown as Apollo,
      snackBar as unknown as SnackbarService,
      formBuilderService,
      formHelpersService,
      {} as ConfirmService,
      { instant: (key: string) => key } as unknown as TranslateService,
      { run: (callback: () => void) => callback() } as NgZone,
      autoTranslateService
    );
    return { component, dialog, dialogRef, snackBar, survey };
  }

  /**
   * Flushes the pending promise callbacks, including the lazy import of the
   * errors modal.
   *
   * @returns Resolves once the promise callbacks ran
   */
  function flushPromises(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
});
