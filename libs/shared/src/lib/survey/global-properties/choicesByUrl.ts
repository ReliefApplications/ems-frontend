import {
  ChoicesRestful,
  QuestionSelectBase,
  Serializer,
  SurveyModel,
} from 'survey-core';
import { isNil, set } from 'lodash';
import jsonpath from 'jsonpath';

type ExtendedChoicesRestful = ChoicesRestful & {
  /** If the request should be a POST request */
  usePost: boolean;
  /** If the request is a GraphQL query */
  isGraphQL: boolean;
  /** Body of the request */
  requestBody: string;
  sendRequest: () => void;
};

/** Default properties of the ChoicesRestful class */
const DEFAULT_PROPERTIES = [
  // New properties
  'usePost',
  'requestBody',

  // Default properties
  'url',
  'path',
  'valueName',
  'titleName',
  'imageLinkName',
  'allowEmptyResponse',
  'attachOriginalItems',
] as const;

/** Class used internally by surveyJS, but not exported */
class XmlParser {
  private parser = new DOMParser();

  // eslint-disable-next-line jsdoc/require-jsdoc
  public assignValue(target: any, name: string, value: any) {
    if (Array.isArray(target[name])) {
      target[name].push(value);
    } else if (target[name] !== undefined) {
      target[name] = [target[name]].concat(value);
    } else if (
      typeof value === 'object' &&
      Object.keys(value).length === 1 &&
      Object.keys(value)[0] === name
    ) {
      target[name] = value[name];
    } else {
      target[name] = value;
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public xml2Json(xmlNode: any, result: any) {
    if (xmlNode.children && xmlNode.children.length > 0) {
      for (let i = 0; i < xmlNode.children.length; i++) {
        const childNode = xmlNode.children[i];
        const childObject = {};
        this.xml2Json(childNode, childObject);
        this.assignValue(result, childNode.nodeName, childObject);
      }
    } else {
      this.assignValue(result, xmlNode.nodeName, xmlNode.textContent);
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public parseXmlString(xmlString: string) {
    const xmlRoot = this.parser.parseFromString(xmlString, 'text/xml');
    const json = {};
    this.xml2Json(xmlRoot, json);
    return json;
  }
}

/**
 * Overwrite some ChoicesRestful methods to allow POST requests
 *
 */
export const init = (): void => {
  Serializer.addProperty('selectBase', {
    name: 'detectionHelper:expression',
    category: 'choicesByUrl',
    visible: false,
    onExecuteExpression: (obj: QuestionSelectBase) => {
      const choicesByUrl = obj.choicesByUrl as ExtendedChoicesRestful;

      let body = obj.requestBody || '';
      (obj.survey as SurveyModel)?.getAllQuestions().forEach((question) => {
        if (body.includes(`{${question.name}}`)) {
          const regex = new RegExp(`{${question.name}}`, 'g');
          body = body.replace(regex, question.value ?? `{${question.name}}`);
        }
      });
      // Checks if Is GraphQL query or not
      if (obj.isGraphQL) {
        choicesByUrl.requestBody = JSON.stringify({ query: body });
      } else {
        choicesByUrl.requestBody = body;
      }
      choicesByUrl.sendRequest();
    },
  });

  Serializer.addProperty('selectBase', {
    name: 'usePost:boolean',
    displayName: 'Use POST',
    category: 'choicesByUrl',
  });

  Serializer.addProperty('selectBase', {
    name: 'isGraphQL:boolean',
    displayName: 'Is GraphQL query',
    category: 'choicesByUrl',
  });

  Serializer.addProperty('selectBase', {
    name: 'requestBody:text',
    displayName: 'Body or query',
    category: 'choicesByUrl',
    dependsOn: ['usePost', 'isGraphQL'],
    visibleIf: (obj: QuestionSelectBase) => obj.usePost,
    onSetValue: (obj: QuestionSelectBase, value: string) => {
      // Updates the request body
      obj.setPropertyValue('requestBody', value);

      let newExp = '';

      (obj.survey as SurveyModel)?.getAllQuestions().forEach((question) => {
        if ((value || '').includes(`{${question.name}}`)) {
          newExp += `{${question.name}} `;
        }
      });

      // Updates the detection helper, adds all dependencies to it
      obj.setPropertyValue('detectionHelper', newExp);
    },
  });

  /**
   * Overwrite choices restful setData method to include requestBody and usePost
   *
   * @param json Input json
   */
  ChoicesRestful.prototype.setData = function (json: any) {
    this.clear();

    const properties = (this.getCustomPropertiesNames() ?? []).concat(
      DEFAULT_PROPERTIES
    );
    for (let i = 0; i < properties.length; i++) {
      if (!isNil(json[properties[i]])) {
        set(this, properties[i], json[properties[i]]);
      }
    }
  };

  /**
   * Get choices restful data
   *
   * @returns ChoicesRestful data, including new properties
   */
  (ChoicesRestful.prototype as any).getData = function () {
    if (this.isEmpty) return null;
    const res = {} as any;
    const properties = (this.getCustomPropertiesNames() ?? []).concat(
      DEFAULT_PROPERTIES
    );
    for (let i = 0; i < properties.length; i++) {
      if (!isNil(this[properties[i]])) {
        set(res, properties[i], this[properties[i]]);
      }
    }
    return res;
  };

  /** Overwrites clear method, to also clear requestBody and usePost */
  (ChoicesRestful.prototype as any).clear = function () {
    this.requestBody = '';
    this.usePost = false;

    // Previous code
    this.url = '';
    this.path = '';
    this.valueName = '';
    this.titleName = '';
    this.imageLinkName = '';
    const properties = this.getCustomPropertiesNames();
    for (let i = 0; i < properties.length; i++) {
      if (this[properties[i]]) {
        set(this, properties[i], '');
      }
    }
  };

  /**
   * Overwrite choices restful getResultAfterPath method to allow nested paths
   *
   * @param result Result fetched from API
   * @returns Result after path is applied
   */
  (ChoicesRestful.prototype as any).getResultAfterPath = function (
    result: any
  ) {
    if (!result) return result;
    if (!this.processedPath) return result;
    const paths = this.getPathes();
    for (let i = 0; i < paths.length; i++) {
      result = jsonpath.query(result, paths[i]);
      if (!result) return null;
    }
    return result;
  };

  /** Overwrites sendRequest to be able to make POST requests */
  (ChoicesRestful.prototype as any).sendRequest = function () {
    this.error = null;

    // Checks if the request body depends on other questions that have not been answered yet
    // If so, no request is made as it would fail anyway
    const questionTemplates =
      (this.owner?.survey as SurveyModel)
        ?.getAllQuestions()
        ?.map((q) => `{${q.name}}`) || [];

    if (questionTemplates?.some((q) => this.requestBody?.includes(q))) {
      return;
    }

    const headers = new Headers();
    headers.append(
      'Content-Type',
      this.owner.requestBody
        ? 'application/json'
        : 'application/x-www-form-urlencoded'
    );

    const options: any = {
      headers,
    };

    Object.assign(options, { method: this.owner.usePost ? 'POST' : 'GET' });
    if (this.requestBody) {
      Object.assign(options, { body: this.requestBody });
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    if (ChoicesRestful.onBeforeSendRequest) {
      ChoicesRestful.onBeforeSendRequest(this, { request: options });
    }
    this.beforeSendRequest();

    fetch(this.processedUrl, options)
      .then((response) => {
        self.beforeLoadRequest();
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        self.onLoad(self.parseResponse(data), self.objHash);
      })
      .catch((error) => {
        self.onError(error.message);
      });
  };

  /**
   * Overwrite choices restful parseResponse method to allow JSON responses
   *
   * @param response Response from API
   * @returns Parsed response
   */
  (ChoicesRestful.prototype as any).parseResponse = function (response: any) {
    let parsedResponse;
    if (
      !!response &&
      typeof response.indexOf === 'function' &&
      response.indexOf('<') === 0
    ) {
      const parser = new XmlParser();
      parsedResponse = parser.parseXmlString(response);
    } else {
      try {
        parsedResponse =
          typeof response === 'string' ? JSON.parse(response) : response;
      } catch (_a) {
        parsedResponse = (response || '')
          .split('\n')
          .map(function (s: any) {
            return s.trim(' ');
          })
          .filter(function (s: any) {
            return !!s;
          });
      }
    }
    return parsedResponse;
  };
};
