import { gql } from '@apollo/client';
import { GlobalOptions } from '../../types';
import { SurveyModel } from 'survey-core';
import { firstValueFrom } from 'rxjs';
import { isEqual } from 'lodash';

type Prescription = {
  start: string;
  end: string;
  aid_frequency: number;
  aids: string[];
};

/**
 *  Generator for the custom function getPrescriptionInfo.
 *
 * @param options Global options
 * @returns The custom function getPrescriptionInfo
 */
export default (options: GlobalOptions) => {
  const { apollo } = options;

  /**
   * Returns an object with info pertaining to each prescription of a family.
   *
   * @param this Self
   * @param this.survey Survey instance
   * @returns Calculated information for each prescription
   */
  return async function getPrescriptionInfo(this: { survey: SurveyModel }) {
    const updatePrescriptionInfo = async (prescription: Prescription) => {
      const DEFAULT_INFO = {
        is_active: false,
        header_text: 'Remplir la prescription',
      };

      if (typeof prescription !== 'object' || !prescription) {
        return { ...DEFAULT_INFO };
      }

      const { start, end, aid_frequency: aidFrequency, aids } = prescription;

      // If the data is not fully filled
      if (!start || !end || !aidFrequency) {
        return { ...prescription, ...DEFAULT_INFO };
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      // calculate the difference in months
      let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
      months -= startDate.getMonth();
      months += endDate.getMonth();

      // result is the number of months between the two dates times the frequency
      const maxAids = startDate > endDate ? 0 : (months || 1) * aidFrequency;
      const endDatePassed = endDate < new Date();

      const aidsQuery = gql`
        query GetAidsInInterval($filter: JSON) {
          allAid(filter: $filter) {
            totalCount
          }
        }
      `;

      const numFoodAidsRes = await firstValueFrom(
        apollo.query<any>({
          query: aidsQuery,
          variables: {
            filter: {
              logic: 'and',
              filters: [
                {
                  field: 'ids',
                  operator: 'in',
                  value: aids ?? [],
                },
                {
                  field: 'items_given',
                  operator: 'contains',
                  value: 'aide alimentaire',
                },
              ],
            },
          },
        })
      );

      const numFoodAids = numFoodAidsRes?.data?.allAid?.totalCount ?? 0;
      const isActive =
        startDate < endDate && !endDatePassed && !(numFoodAids >= maxAids);
      return {
        ...prescription,
        is_active: isActive,
        header_text: isActive
          ? 'Prescription en cours de validité'
          : endDatePassed
          ? 'Prescription expirée'
          : 'Prescription déjà utilisée',
      };
    };

    if (!this.survey.onQuestionValueChanged) {
      return;
    }

    const prescriptionsQuestion =
      this.survey.getQuestionByName('prescriptions');
    const prescriptions: Prescription[] = prescriptionsQuestion?.value;

    this.survey.onQuestionValueChanged['prescriptions'] = async (
      options: any
    ) => {
      if (options.name === 'prescriptions') {
        if (Array.isArray(options.value)) {
          this.survey.setVariable('loading_prescription_info', true);
          const info = await Promise.all(
            options.value.map(updatePrescriptionInfo)
          );
          if (!isEqual(info, options.value)) {
            prescriptionsQuestion.value = info;
          }
          this.survey.setVariable('loading_prescription_info', false);
        }
      }
    };

    // Check if a listener is already set
    if (!this.survey.prescriptionListenerSet && Array.isArray(prescriptions)) {
      this.survey.prescriptionListenerSet = true;
      this.survey.setVariable('loading_prescription_info', true);

      // Initialize the prescription info
      const info = await Promise.all(prescriptions.map(updatePrescriptionInfo));
      if (!isEqual(info, prescriptionsQuestion.value)) {
        prescriptionsQuestion.value = info;
      }
      this.survey.setVariable('loading_prescription_info', false);
    }
  };
};
