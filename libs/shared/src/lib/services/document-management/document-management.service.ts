import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { SnackbarSpinnerComponent } from '../../components/snackbar-spinner/snackbar-spinner.component';
import { RestService } from '../rest/rest.service';
import { Question } from 'survey-core';

/**
 * Available properties from the CS API Documentation
 */
export const CS_DOCUMENTS_PROPERTIES = [
  { text: 'Aetiology', value: 'aetiologys', bodyKey: 'Aetiology' },
  {
    text: 'Confidentiality',
    value: 'informationconfidentialitys',
    bodyKey: 'InformationConfidentiality',
  },
  { text: 'Country', value: 'countrys', bodyKey: 'Country' },
  { text: 'Disease Condition', value: 'diseaseconds', bodyKey: 'DiseaseCond' },
  // { text: 'Document Category', value: 'documentcategorys', bodyKey: '' },
  { text: 'Document Type', value: 'documenttypes', bodyKey: 'DocumentType' },
  { text: 'Hazard', value: 'hazards', bodyKey: 'Hazard' },
  {
    text: 'IHR Communication',
    value: 'ihrcommunications',
    bodyKey: 'IhrCommunication',
  },
  {
    text: 'IMS Function',
    value: 'assignmentfunctions',
    bodyKey: 'AssignmentFunction',
  },
  // { text: 'IMS Role', value: 'documentroles', bodyKey: '' },
  { text: 'Language', value: 'languages', bodyKey: 'Language' },
  { text: 'Occurrence', value: 'occurrences', bodyKey: '' },
  {
    text: 'Occurrence Type',
    value: 'occurrencetypes',
    bodyKey: 'OccurrenceType',
  },
  { text: 'Region', value: 'regions', bodyKey: 'Region' },
  {
    text: 'Source of information - type',
    value: 'sourceofinformations',
    bodyKey: 'SourceOfInformation',
  },
  { text: 'Syndrome', value: 'syndromes', bodyKey: 'Syndrome' },
];

/** Snackbar duration in ms */
const SNACKBAR_DURATION = 3000;

/**
 * Shared document management service. Handles export and upload documents in document management system.
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentManagementService {
  /**
   * Shared document management service. Handles export and upload documents in document management system.
   *
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param restService Shared rest service
   * @param document Document
   * @param environment Environment
   */
  constructor(
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private restService: RestService,
    @Inject(DOCUMENT) private document: Document,
    @Inject('environment') private environment: any
  ) {}

  /**
   * Set up a snackbar element with the given message and duration
   *
   * @param {string} translationKey Translation key for the file download snackbar message
   * @param {duration} duration Time duration of the opened snackbar element
   * @returns snackbar reference
   */
  private createLoadingSnackbarRef(translationKey: string, duration = 0) {
    // Opens a loader in a snackbar
    const snackBarRef = this.snackBar.openComponentSnackBar(
      SnackbarSpinnerComponent,
      {
        duration,
        data: {
          message: this.translate.instant(translationKey),
          loading: true,
        },
      }
    );
    return snackBarRef;
  }

  /**
   * Set up needed headers and response information for the file download action
   *
   * @param translationKey Translation key for the file download snackbar message
   * @returns snackbar reference and header for the file download request
   */
  private triggerFileDownloadMessage(translationKey: string) {
    // Opens a loader in a snackbar
    const snackBarRef = this.createLoadingSnackbarRef(translationKey);
    // Should be added into the request for cs documentation api
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return { snackBarRef, headers };
  }

  /**
   * Downloads file from the server
   *
   * @param file Uploaded file
   * @param file.name file name
   * @param file.content file content information
   * @param file.content.driveId file drive id
   * @param file.content.itemId file item id
   * @param options (optional) request options
   */
  getFile(
    file: { name: string; content: { driveId: string; itemId: string } },
    options?: any
  ): void {
    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.download.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    const url = `${this.environment.csApiUrl}/documents/drives/${file.content.driveId}/items/${file.content.itemId}/content`;
    this.restService
      .get(url, { ...options, responseType: 'blob', headers })
      .subscribe({
        next: (res) => {
          const blob = new Blob([res]);
          this.saveFile(file.name, blob);
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.download.ready'
          );
          snackBarSpinner.instance.loading = false;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
        },
        error: () => {
          snackBarSpinner.instance.message = this.translate.instant(
            'common.notifications.file.download.error'
          );
          snackBarSpinner.instance.loading = false;
          snackBarSpinner.instance.error = true;
          snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
        },
      });
  }

  /**
   * Saves file from blob
   *
   * @param fileName name of the file
   * @param blob File blob
   */
  private saveFile(fileName: string, blob: Blob): void {
    const link = this.document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    this.document.body.append(link);
    link.click();
    URL.revokeObjectURL(link.href);
    link.remove();
  }

  /**
   * Uploads a file
   *
   * @param file file to upload
   * @param question related question from where to extract body params on cs upload
   * @returns http upload request
   */
  async uploadFile(file: any, question: Question): Promise<any> {
    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.upload.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;
    const fileStream = await this.transformFileToValidInput(file);
    const bodyFilter = Object.create({});
    const driveId = question.getPropertyValue('driveoccurrencesvalue');
    CS_DOCUMENTS_PROPERTIES.forEach((dp) => {
      const value = question.getPropertyValue(dp.bodyKey);
      if (!!value && value.length) {
        Object.assign(bodyFilter, { [dp.bodyKey]: value });
      }
    });
    const body = {
      ...bodyFilter,
      FileStream: fileStream,
      FileName: file.name,
    };
    return new Promise((resolve, reject) => {
      this.restService
        .post(
          `${this.environment.csApiUrl}/documents/drives/${driveId}/items`,
          body,
          {
            headers,
          }
        )
        .subscribe({
          next: (data) => {
            const { itemId, driveId } = data;
            snackBarSpinner.instance.message = this.translate.instant(
              'common.notifications.file.upload.ready'
            );
            snackBarSpinner.instance.loading = false;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
            resolve({
              driveId,
              itemId,
            });
          },
          error: () => {
            snackBarSpinner.instance.message = this.translate.instant(
              'common.notifications.file.upload.error'
            );
            snackBarSpinner.instance.loading = false;
            snackBarSpinner.instance.error = true;
            snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
            reject(null);
          },
        });
    });
  }

  /**
   * Transforms given file value into a valid base 64 input for document management api.
   *
   * @param file File to transform
   * @returns A valid base 64 input value for the cs api endpoint
   */
  private transformFileToValidInput(file: any) {
    const fileReader = new FileReader();
    return new Promise((resolve) => {
      (fileReader as any).onload = () => {
        resolve(fileReader.result?.toString().split(',')[1]);
      };
      fileReader.readAsDataURL(file);
    });
  }
}
