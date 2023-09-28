import { Serializer } from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';
import {
  CustomPropertyGridComponentTypes,
  CustomPropertyGridEditors,
} from './components.enum';

/**
 * Register custom element and custom property for the survey of the given custom type
 *
 * @param {CustomPropertyGridComponentTypes} componentType Custom type of our enum
 */
export const registerCustomPropertyEditor = (
  componentType: CustomPropertyGridComponentTypes
) => {
  const propertyJson = {
    /**
     * Set the fit property of the custom property
     *
     * @param prop Survey question properties
     * @param prop.type Survey question property type
     * @returns Fit condition for the custom component
     */
    fit: function (prop: { type: string }) {
      return (
        prop.type === componentType ||
        // Fix needed for previously saved form structures
        // resources and resource questions used same components for some property grid editors but named as 'resourceFields' or 'resourcesFields' depending on the question
        // after the form is saved the new type would be set in the structure and this check could eventually disappear from here
        (prop.type === 'resourceDropdown' &&
          componentType ===
            CustomPropertyGridComponentTypes.resourcesDropdown) ||
        (prop.type === 'resourceFields' &&
          componentType ===
            CustomPropertyGridComponentTypes.resourcesAvailableFields)
      );
    },
    /**
     * Returns json for serialized registered custom property if the fit condition is satisfied
     *
     * @returns The related serialized json type for the registered custom property
     */
    getJSON: function () {
      return {
        type: componentType,
      };
    },
  };

  if (!Serializer.findClass(componentType)) {
    Serializer.addClass(
      componentType,
      [],
      function () {
        return new CustomPropertyGridEditors[componentType].model('');
      },
      'question'
    );
  }

  PropertyGridEditorCollection.register(propertyJson);
};
