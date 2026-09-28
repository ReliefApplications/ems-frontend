import { Injector } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApplicationService } from '../../../services/application/application.service';
import { GridSettingsFormFactory } from './grid-settings.forms';

/**
 * Builds a saved scalar field, as stored in a grid action configuration.
 *
 * @param name Field name
 * @returns Saved field definition
 */
const savedField = (name: string) => ({
  name,
  type: 'String',
  kind: 'SCALAR',
  label: name,
});

describe('GridSettingsFormFactory', () => {
  let factory: GridSettingsFormFactory;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    destroy$ = new Subject<boolean>();
    const injector = Injector.create({
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        {
          provide: ApplicationService,
          useValue: { application: new BehaviorSubject(null) },
        },
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key },
        },
      ],
    });
    factory = new GridSettingsFormFactory(injector, destroy$);
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.complete();
  });

  describe('createGridActionFormGroup', () => {
    describe('send separate email controls', () => {
      it('defaults to a single email with no per-record recipient field', () => {
        const form = factory.createGridActionFormGroup(null);

        expect(form.get('sendSeparateEmail')?.value).toBe(false);
        expect((form.get('separateEmailFields') as FormArray).length).toBe(0);
        expect(form.get('distributionList')?.value).toBeNull();
      });

      it('hydrates the send separate email flag and its recipient fields', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
          sendSeparateEmail: true,
          separateEmailFields: [savedField('email'), savedField('backup')],
        });

        expect(form.get('sendSeparateEmail')?.value).toBe(true);
        const fields = form.get('separateEmailFields') as FormArray;
        expect(fields.length).toBe(2);
        expect(fields.getRawValue().map((field) => field.name)).toEqual([
          'email',
          'backup',
        ]);
      });
    });

    describe('distribution list', () => {
      it('is optional when sending mail', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
        });

        expect(form.get('distributionList')?.value).toBeNull();
        expect(form.get('distributionList')?.hasError('required')).toBe(false);
        expect(form.get('distributionList')?.valid).toBe(true);
      });

      it('can be set alongside send separate email', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
          distributionList: 'dl-1',
          sendSeparateEmail: true,
          separateEmailFields: [savedField('email')],
        });

        expect(form.get('distributionList')?.value).toBe('dl-1');
        expect(form.get('sendSeparateEmail')?.value).toBe(true);
        expect(form.errors).toBeNull();
      });
    });

    describe('sendSeparateEmailRecipientValidator', () => {
      it('passes when the action does not send mail', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: false,
          sendSeparateEmail: true,
        });

        expect(form.errors).toBeNull();
      });

      it('passes when send separate email is off, even without recipient fields', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
          sendSeparateEmail: false,
        });

        expect(form.errors).toBeNull();
      });

      it('flags a missing recipient source when send separate email has no field', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
          sendSeparateEmail: true,
          separateEmailFields: [],
        });

        expect(form.errors).toEqual({ missingRecipientSource: true });
        expect(form.valid).toBe(false);
      });

      it('does not accept a distribution list as the per-record recipient source', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
          distributionList: 'dl-1',
          sendSeparateEmail: true,
          separateEmailFields: [],
        });

        expect(form.errors).toEqual({ missingRecipientSource: true });
      });

      it('passes once at least one recipient field is configured', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
          sendSeparateEmail: true,
          separateEmailFields: [savedField('email')],
        });

        expect(form.errors).toBeNull();
        expect(form.valid).toBe(true);
      });

      it('re-evaluates as the flag and the recipient fields change', () => {
        const form = factory.createGridActionFormGroup({
          sendMail: true,
          templates: ['template-1'],
          bodyFields: [savedField('name')],
        });
        expect(form.errors).toBeNull();

        form.get('sendSeparateEmail')?.setValue(true);
        expect(form.errors).toEqual({ missingRecipientSource: true });

        (form.get('separateEmailFields') as FormArray).push(
          new FormBuilder().group({ name: ['email'] })
        );
        expect(form.errors).toBeNull();

        (form.get('separateEmailFields') as FormArray).clear();
        expect(form.errors).toEqual({ missingRecipientSource: true });

        form.get('sendSeparateEmail')?.setValue(false);
        expect(form.errors).toBeNull();
      });
    });
  });
});
