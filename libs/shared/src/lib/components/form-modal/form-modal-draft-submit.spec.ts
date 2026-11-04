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
import { FormModalComponent } from './form-modal.component';
import { ADD_RECORD, EDIT_RECORD } from './graphql/mutations';

describe('FormModalComponent draft submission', () => {
  it('creates the record from the saved draft', async () => {
    const { component, apollo, dialogRef, survey } = createComponent({
      template: 'form-id',
    });
    await component.ngOnInit();
    component.lastDraftRecord = 'draft-id';
    survey.setValue('title', 'Submitted');

    component.onComplete(survey);
    await flushPromises();

    expect(apollo.mutate).toHaveBeenCalledTimes(1);
    expect(apollo.mutate.mock.calls[0][0].mutation).toBe(ADD_RECORD);
    expect(apollo.mutate.mock.calls[0][0].variables).toEqual(
      expect.objectContaining({
        form: 'form-id',
        data: { title: 'Submitted' },
        draftId: 'draft-id',
      })
    );
    // The back-end deleted the draft: it is forgotten
    expect(component.lastDraftRecord).toBeUndefined();
    expect(dialogRef.close).toHaveBeenCalled();
    component.ngOnDestroy();
  });

  it('creates the record from a draft opened from its id', async () => {
    const { component, apollo, dialogRef, survey } = createComponent({
      recordId: 'draft-id',
      record: { id: 'draft-id', draft: true },
    });
    await component.ngOnInit();
    survey.setValue('title', 'Submitted');

    component.onComplete(survey);
    await flushPromises();

    expect(apollo.mutate).toHaveBeenCalledTimes(1);
    expect(apollo.mutate.mock.calls[0][0].mutation).toBe(ADD_RECORD);
    expect(apollo.mutate.mock.calls[0][0].variables).toEqual(
      expect.objectContaining({ form: 'form-id', draftId: 'draft-id' })
    );
    expect(dialogRef.close).toHaveBeenCalled();
    component.ngOnDestroy();
  });

  it('creates a record without draft id when no draft was saved', async () => {
    const { component, apollo, survey } = createComponent({
      template: 'form-id',
    });
    await component.ngOnInit();

    component.onComplete(survey);
    await flushPromises();

    expect(apollo.mutate.mock.calls[0][0].mutation).toBe(ADD_RECORD);
    expect(apollo.mutate.mock.calls[0][0].variables).not.toHaveProperty(
      'draftId'
    );
    component.ngOnDestroy();
  });

  it('updates a submitted record', async () => {
    const { component, apollo, survey } = createComponent({
      recordId: 'record-id',
      record: { id: 'record-id', draft: false },
    });
    await component.ngOnInit();

    component.onComplete(survey);
    await flushPromises();

    expect(apollo.mutate.mock.calls[0][0].mutation).toBe(EDIT_RECORD);
    expect(apollo.mutate.mock.calls[0][0].variables).toEqual(
      expect.objectContaining({ id: 'record-id' })
    );
    component.ngOnDestroy();
  });

  /**
   * Creates the modal, whose mutations succeed.
   *
   * @param options modal options
   * @param options.template id of the form to display
   * @param options.recordId id of the record to open
   * @param options.record record returned when querying the opened record
   * @returns the modal component and its mocked dependencies
   */
  function createComponent(options: {
    template?: string;
    recordId?: string;
    record?: Record<string, any>;
  }): {
    component: FormModalComponent;
    apollo: { query: jest.Mock; mutate: jest.Mock };
    dialogRef: { close: jest.Mock };
    survey: SurveyModel;
  } {
    const survey = new SurveyModel({
      elements: [{ type: 'text', name: 'title' }],
    });
    const form = { id: 'form-id', structure: '{}', fields: [], metadata: [] };
    const apollo = {
      query: jest
        .fn()
        .mockImplementation(({ variables }) =>
          of(
            variables?.id === options.recordId && options.record
              ? { data: { record: { ...options.record, data: {}, form } } }
              : { data: { form } }
          )
        ),
      mutate: jest.fn().mockReturnValue(
        of({
          data: {
            addRecord: { id: 'record-id', draft: false, validationErrors: [] },
            editRecord: { id: 'record-id', draft: false, validationErrors: [] },
          },
        })
      ),
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
    const dialogRef = { close: jest.fn() };
    const component = new FormModalComponent(
      {
        template: options.template,
        recordId: options.recordId,
        askForConfirm: false,
      },
      { open: jest.fn() } as unknown as Dialog,
      dialogRef as unknown as DialogRef<FormModalComponent>,
      apollo as unknown as Apollo,
      { openSnackBar: jest.fn() } as unknown as SnackbarService,
      formBuilderService,
      formHelpersService,
      {} as ConfirmService,
      { instant: (key: string) => key } as unknown as TranslateService,
      { run: (callback: () => void) => callback() } as NgZone,
      autoTranslateService
    );
    return { component, apollo, dialogRef, survey };
  }

  /**
   * Flushes the pending promise callbacks.
   *
   * @returns Resolves once the promise callbacks ran
   */
  function flushPromises(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
});
