import { Inject, Injectable } from '@angular/core';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../survey/creator';
import { initCustomWidgets } from '../survey/init';
import { DomService } from './dom.service';
import { MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { SafeAuthService } from './auth.service';
import { SafeDownloadService } from './download.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafeFormService {

  constructor(
    @Inject('environment') environment: any,
    public domService: DomService,
    public dialog: MatDialog,
    public apollo: Apollo,
    public formBuilder: FormBuilder,
    public authService: SafeAuthService,
    private downloadService: SafeDownloadService
  ) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(SurveyKo, domService, dialog, apollo, formBuilder, authService, environment);

    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);

    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(Survey, domService, dialog, apollo, formBuilder, authService, environment);
  }

  createSurvey(
    structure: string,
    readOnly: boolean,
    pages: BehaviorSubject<any[]>,
    language: string,
    temporaryFilesStorage?: any): Survey.Survey {
    const survey = new Survey.Model(structure);
    if (!readOnly) {
      survey.onClearFiles.add((_, options) => options.callback('success'));
      survey.onUploadFiles.add((sender, options) => this.onUploadFiles(sender, options, temporaryFilesStorage));
      survey.onUpdateQuestionCssClasses.add((_, options) => this.onSetCustomCss(options));
      survey.onSettingQuestionErrors.add(() => {
        this.setPages(survey, pages);
      });
    } else {
      survey.mode = 'display';
    }
    survey.onDownloadFile.add((sender, options) => this.onDownloadFile(sender, options));
    survey.onPageVisibleChanged.add(() => {
      this.setPages(survey, pages);
    });
    survey.locale = language ? language : 'en';
    survey.showNavigationButtons = 'none';
    survey.showProgressBar = 'off';
    const onCompleteExpression = survey.toJSON().onCompleteExpression;
    if (onCompleteExpression) {
      survey.onCompleting.add(() => {
        survey.runExpression(onCompleteExpression);
      });
    }
    this.setPages(survey, pages);
    return survey;
  }

  private onUploadFiles(survey: Survey.SurveyModel, options: any, temporaryFilesStorage: any): void {
    if (temporaryFilesStorage[options.name] !== undefined) {
      temporaryFilesStorage[options.name].concat(options.files);
    } else {
      temporaryFilesStorage[options.name] = options.files;
    }
    let content: any[] = [];
    options
      .files
      .forEach((file: any) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          content = content.concat([
            {
              name: file.name,
              type: file.type,
              content: fileReader.result,
              file
            }
          ]);
          if (content.length === options.files.length) {
            options.callback('success', content.map((fileContent) => {
              return { file: fileContent.file, content: fileContent.content };
            }));
          }
        };
        fileReader.readAsDataURL(file);
      });
  }

  private onDownloadFile(survey: Survey.SurveyModel, options: any): void {
    if (options.content.indexOf('base64') !== -1 || options.content.indexOf('http') !== -1) {
      options.callback('success', options.content);
      return;
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.downloadService.baseUrl}/download/file/${options.content}`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('msal.idtoken')}`);
      xhr.onloadstart = () => {
        xhr.responseType = 'blob';
      };
      xhr.onload = () => {
        const file = new File([xhr.response], options.fileValue.name, { type: options.fileValue.type });
        const reader = new FileReader();
        reader.onload = (e) => {
          options.callback('success', e.target?.result);
        };
        reader.readAsDataURL(file);
      };
      xhr.send();
    }
  }

  /**
   * Add custom CSS classes to the survey elements.
   * @param survey current survey.
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += 'safe-qst-content';
  }

  private setPages(survey: Survey.Survey, pages: BehaviorSubject<any[]>): void {
    const pageList = [];
    if (survey) {
      for (const page of survey.pages) {
        if (page.isVisible) {
          pageList.push(page);
        }
      }
    }
    pages.next(pageList);
  }
}
