import { FormBuilder } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UniquenessRule } from '../../models/resource.model';
import { EditUniquenessRuleModalComponent } from './edit-uniqueness-rule-modal.component';

describe('EditUniquenessRuleModalComponent', () => {
  /**
   * Creates the modal for a rule.
   *
   * @param rule Rule to edit, if any
   * @param currentLang Language of the user
   * @returns the modal component
   */
  const createComponent = (rule?: UniquenessRule, currentLang = 'en') =>
    new EditUniquenessRuleModalComponent(
      new FormBuilder(),
      {} as DialogRef<UniquenessRule>,
      { rule, fields: [{ name: 'org_code' }] },
      { currentLang } as TranslateService
    );

  describe('message', () => {
    it('saves the message by language, and in the language of the user', () => {
      const component = createComponent(
        { fields: ['org_code'], severity: 'error' },
        'fr'
      );
      component.form.patchValue({
        message: { en: 'Code already used', fr: 'Code déjà utilisé' },
      });
      expect(component.value.message).toEqual('Code déjà utilisé');
      expect(component.value.messageTranslations).toEqual({
        en: 'Code already used',
        fr: 'Code déjà utilisé',
      });
    });

    it('loads the translations of an existing rule', () => {
      const translations = { en: 'Code already used', uk: 'Код уже є' };
      const component = createComponent({
        fields: ['org_code'],
        severity: 'error',
        message: 'Code already used',
        messageTranslations: translations,
      });
      expect(component.form.value.message).toEqual(translations);
      expect(component.value.messageTranslations).toEqual(translations);
    });

    it('keeps the message of a rule saved without translation', () => {
      for (const messageTranslations of [undefined, null, {}]) {
        const component = createComponent({
          fields: ['org_code'],
          severity: 'error',
          message: 'Code already used',
          messageTranslations,
        });
        expect(component.form.value.message).toEqual('Code already used');
        expect(component.value.message).toEqual('Code already used');
        expect(component.value.messageTranslations).toBeUndefined();
      }
    });

    it('saves no message when it is left empty', () => {
      const component = createComponent();
      expect(component.value.message).toBeUndefined();
      expect(component.value.messageTranslations).toBeUndefined();

      // Emptied after being entered
      component.form.patchValue({ message: {} });
      expect(component.value.message).toBeUndefined();
      expect(component.value.messageTranslations).toBeUndefined();
    });
  });

  describe('condition', () => {
    const filter = {
      logic: 'or' as const,
      filters: [
        { field: 'status', operator: 'eq', value: 'Open' },
        {
          logic: 'and',
          filters: [{ field: 'urgent', operator: 'eq', value: true }],
        },
      ],
    };

    it('loads the filter of an existing rule in the filter builder', () => {
      const component = createComponent({
        fields: ['org_code'],
        severity: 'error',
        condition: filter,
      });
      const condition = component.conditionForm.getRawValue();
      expect(condition.logic).toEqual('or');
      expect(condition.filters).toHaveLength(2);
      expect(condition.filters[0]).toMatchObject(filter.filters[0]);
      expect(condition.filters[1].filters[0]).toMatchObject({
        field: 'urgent',
        operator: 'eq',
        value: true,
      });
    });

    it('saves the filter built in the filter builder', () => {
      const component = createComponent({
        fields: ['org_code'],
        severity: 'error',
        condition: filter,
      });
      const condition = component.value.condition;
      expect(condition?.logic).toEqual('or');
      expect(condition?.filters[0]).toMatchObject(filter.filters[0]);
    });

    it('saves no filter when the rule applies to all records', () => {
      expect(createComponent().value.condition).toBeUndefined();
      expect(
        createComponent({
          fields: ['org_code'],
          severity: 'error',
          condition: null,
        }).value.condition
      ).toBeUndefined();
      expect(
        createComponent({
          fields: ['org_code'],
          severity: 'error',
          condition: { logic: 'and', filters: [] },
        }).value.condition
      ).toBeUndefined();
    });
  });
});
