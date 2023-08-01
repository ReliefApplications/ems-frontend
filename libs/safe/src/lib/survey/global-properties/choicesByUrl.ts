import { get } from 'lodash';
import { QuestionSelectBase } from 'survey-angular';

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
 * @param Survey Survey instance
 */
export const init = (Survey: any): void => {
  Survey.Serializer.findClass('choicesByUrl').createProperty({
    name: 'usePost:boolean',
    displayName: 'Use POST',
  });

  Survey.Serializer.findClass('choicesByUrl').createProperty({
    name: 'requestBody:text',
    dependsOn: 'usePost',
    visibleIf: (obj: QuestionSelectBase) => obj.usePost,
  });

  /**
   * Overwrite choices restful setData method to include requestBody and usePost
   *
   * @param json Input json
   */
  Survey.ChoicesRestful.prototype.setData = function (json: any) {
    this.clear();
    // adds requestBody
    if (json.requestBody) this.requestBody = json.requestBody;
    if (json.usePost !== undefined) this.usePost = json.usePost;

    // Previous code
    if (json.url) this.url = json.url;
    if (json.path) this.path = json.path;
    if (json.valueName) this.valueName = json.valueName;
    if (json.titleName) this.titleName = json.titleName;
    if (json.imageLinkName) this.imageLinkName = json.imageLinkName;
    if (json.allowEmptyResponse !== undefined)
      this.allowEmptyResponse = json.allowEmptyResponse;
    if (json.attachOriginalItems !== undefined)
      this.attachOriginalItems = json.attachOriginalItems;
    const properties = this.getCustomPropertiesNames();
    for (let i = 0; i < properties.length; i++) {
      if (json[properties[i]]) this[properties[i]] = json[properties[i]];
    }
  };

  /** @returns ChoicesRestful data, including new properties */
  Survey.ChoicesRestful.prototype.getData = function () {
    if (this.isEmpty) return null;
    const res = {} as any;
    if (this.url) res['url'] = this.url;
    if (this.path) res['path'] = this.path;
    if (this.valueName) res['valueName'] = this.valueName;
    if (this.titleName) res['titleName'] = this.titleName;
    if (this.imageLinkName) res['imageLinkName'] = this.imageLinkName;
    if (this.requestBody) res['requestBody'] = this.requestBody;
    if (this.usePost) res['usePost'] = this.usePost;
    if (this.allowEmptyResponse)
      res['allowEmptyResponse'] = this.allowEmptyResponse;
    if (this.attachOriginalItems)
      res['attachOriginalItems'] = this.attachOriginalItems;
    const properties = this.getCustomPropertiesNames();
    for (let i = 0; i < properties.length; i++) {
      if (this[properties[i]]) res[properties[i]] = this[properties[i]];
    }
    return res;
  };

  /**
   * Overwrite choices restful getResultAfterPath method to allow nested paths
   *
   * @param result Result fetched from API
   * @returns Result after path is applied
   */
  Survey.ChoicesRestful.prototype.getResultAfterPath = function (result: any) {
    if (!result) return result;
    if (!this.processedPath) return result;
    const paths = this.getPathes();
    for (let i = 0; i < paths.length; i++) {
      result = get(result, paths[i]);
      if (!result) return null;
    }
    return result;
  };

  /** Overwrites sendRequest to be able to make POST requests */
  Survey.ChoicesRestful.prototype.sendRequest = function () {
    const headers = new Headers();
    headers.append(
      'Content-Type',
      this.requestBody
        ? 'application/json'
        : 'application/x-www-form-urlencoded'
    );

    const options: RequestInit = {
      headers,
    };

    Object.assign(options, { method: this.usePost ? 'POST' : 'GET' });
    if (this.requestBody) Object.assign(options, { body: this.requestBody });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

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

    if (Survey.ChoicesRestful.onBeforeSendRequest) {
      Survey.ChoicesRestful.onBeforeSendRequest(this, { request: options });
    }

    this.beforeSendRequest();
  };

  /**
   * Overwrite choices restful parseResponse method to allow JSON responses
   *
   * @param response Response from API
   * @returns Parsed response
   */
  Survey.ChoicesRestful.prototype.parseResponse = function (response: any) {
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
