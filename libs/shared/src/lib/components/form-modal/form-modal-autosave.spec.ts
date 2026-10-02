import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { NgZone } from '@angular/core';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of, Subject } from 'rxjs';
import { SurveyModel } from 'survey-core';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { FormModalComponent } from './form-modal.component';

describe('FormModalComponent draft auto-save', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('keeps manual draft save available after editing a draft clone', async () => {
    const { apollo, component, saveAsDraft, survey } = createComponent(true);

    await component.ngOnInit();
    survey.setValue('title', 'User edit');
    jest.advanceTimersByTime(5000);

    expect(apollo.mutate).not.toHaveBeenCalled();
    expect(component.disableSaveAsDraft).toBe(false);

    await component.saveAsDraft();

    expect(saveAsDraft).toHaveBeenCalledTimes(1);
    expect(component.lastDraftRecord).toBe('manual-draft-id');
    expect(component.disableSaveAsDraft).toBe(true);
    component.ngOnDestroy();
  });

  it('auto-saves five seconds after the latest user edit', async () => {
    const { apollo, component, survey } = createComponent(false);
    await component.ngOnInit();

    survey.setValue('title', 'First edit');
    jest.advanceTimersByTime(4000);
    survey.setValue('title', 'Latest edit');
    jest.advanceTimersByTime(4999);

    expect(apollo.mutate).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(apollo.mutate).toHaveBeenCalledTimes(1);
    expect(component.lastDraftRecord).toBe('draft-id');
    expect(component.lastAutoSavedAt).toBeInstanceOf(Date);
    component.ngOnDestroy();
  });

  it('shows feedback after a selected draft is loaded', () => {
    const { component, snackBar } = createComponent(false);

    component.onLoadDraftRecord('draft-id');

    expect(snackBar.openSnackBar).toHaveBeenCalledWith(
      'components.form.draftRecords.successLoad'
    );
  });

  it('ignores an autosave response after another draft is loaded', async () => {
    const response = new Subject<{
      data: { addRecord: { id: string } };
    }>();
    const { apollo, component, survey } = createComponent(false);
    apollo.mutate.mockReturnValue(response);
    await component.ngOnInit();

    survey.setValue('title', 'Old draft data');
    jest.advanceTimersByTime(5000);
    component.onLoadDraftRecord('selected-draft-id');
    response.next({ data: { addRecord: { id: 'stale-draft-id' } } });
    response.complete();

    expect(component.lastDraftRecord).toBe('selected-draft-id');
    expect(component.lastAutoSavedAt).toBeUndefined();
    component.ngOnDestroy();
  });

  /**
   * Creates a modal with a real SurveyJS model and mocked dependencies.
   *
   * @param isDraftClone Whether the modal is cloning a draft
   * @returns Component and test collaborators
   */
  function createComponent(isDraftClone: boolean): {
    apollo: { query: jest.Mock; mutate: jest.Mock };
    component: FormModalComponent;
    saveAsDraft: jest.Mock;
    snackBar: { openSnackBar: jest.Mock };
    survey: SurveyModel;
  } {
    const survey = new SurveyModel({
      elements: [{ type: 'text', name: 'title' }],
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
      mutate: jest
        .fn()
        .mockReturnValue(of({ data: { addRecord: { id: 'draft-id' } } })),
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
    const saveAsDraft = jest.fn(
      (
        _survey: SurveyModel,
        _formId: string,
        _draftId?: string,
        callback?: (details: { id?: string }) => void
      ) => callback?.({ id: 'manual-draft-id' })
    );
    const snackBar = { openSnackBar: jest.fn() };
    const component = new FormModalComponent(
      {
        template: 'form-id',
        ...(isDraftClone && {
          prefillData: { title: 'Cloned draft' },
          isDraftClone: true,
        }),
        askForConfirm: false,
      },
      {} as Dialog,
      {} as DialogRef<FormModalComponent>,
      apollo as unknown as Apollo,
      snackBar as unknown as SnackbarService,
      formBuilderService,
      { saveAsDraft } as unknown as FormHelpersService,
      {} as ConfirmService,
      { instant: (key: string) => key } as unknown as TranslateService,
      { run: (callback: () => void) => callback() } as NgZone,
      autoTranslateService
    );

    return { apollo, component, saveAsDraft, snackBar, survey };
  }
});
