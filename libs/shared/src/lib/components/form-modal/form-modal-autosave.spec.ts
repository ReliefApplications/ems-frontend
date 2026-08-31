import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { NgZone } from '@angular/core';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { SurveyModel } from 'survey-core';
import { AuthService } from '../../services/auth/auth.service';
import { AutoTranslateService } from '../../services/auto-translate/auto-translate.service';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { FormBuilderService } from '../../services/form-builder/form-builder.service';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { FormModalComponent } from './form-modal.component';

describe('FormModalComponent clone auto-save', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should keep manual draft save available after editing a draft clone', async () => {
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
      mutate: jest.fn().mockReturnValue(
        of({
          data: { addRecord: { id: 'draft-id' } },
        })
      ),
    } as unknown as Apollo;
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
    const component = new FormModalComponent(
      {
        template: 'form-id',
        prefillData: { title: 'Cloned draft' },
        isDraftClone: true,
        askForConfirm: false,
      },
      {} as Dialog,
      {} as DialogRef<FormModalComponent>,
      apollo,
      { openSnackBar: jest.fn() } as unknown as SnackbarService,
      {} as AuthService,
      formBuilderService,
      { saveAsDraft } as unknown as FormHelpersService,
      {} as ConfirmService,
      { instant: (key: string) => key } as unknown as TranslateService,
      { run: (callback: () => void) => callback() } as NgZone,
      autoTranslateService
    );

    await component.ngOnInit();
    jest.advanceTimersByTime(600);

    expect(survey.data).toEqual({ title: 'Cloned draft' });
    expect(apollo.mutate).not.toHaveBeenCalled();

    survey.setValue('title', 'User edit');
    jest.advanceTimersByTime(600);

    expect(apollo.mutate).not.toHaveBeenCalled();
    expect(component.disableSaveAsDraft).toBe(false);

    await component.saveAsDraft();

    expect(saveAsDraft).toHaveBeenCalledTimes(1);
    expect(component.lastDraftRecord).toBe('manual-draft-id');
    expect(component.disableSaveAsDraft).toBe(true);

    component.ngOnDestroy();
  });
});
