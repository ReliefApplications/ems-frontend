import { ElementFactory, Serializer } from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';
import {
  CustomPropertyGridComponentTypes,
  CustomPropertyGridEditors,
} from './custom-components.enum';

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
      return prop.type === componentType;
    },
    /**
     * Returns json for serialized registered custom property if the fit condition is satisfied
     *
     * @returns The related serialzied json type for the registered custom property
     */
    getJSON: function () {
      return {
        type: componentType,
      };
    },
  };
  if (!ElementFactory.Instance.getAllTypes().includes(componentType)) {
    ElementFactory.Instance.registerElement(componentType, (name) => {
      return new CustomPropertyGridEditors[componentType](name);
    });
  }
  if (!Serializer.findClass(componentType)) {
    Serializer.addClass(
      componentType,
      [],
      function () {
        return new CustomPropertyGridEditors[componentType]('');
      },
      'question'
    );
  }
  PropertyGridEditorCollection.register(propertyJson);
};
