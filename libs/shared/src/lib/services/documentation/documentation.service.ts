import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { SnackbarSpinnerComponent } from '../../components/snackbar-spinner/snackbar-spinner.component';
import { RestService } from '../rest/rest.service';

/** Allowed file types */ // We may need to allow configuration about that
// const ALLOWED_FILE_TYPES =
//   '.BMP,.GIF,.JPG,.JPEG,.PNG,.HTM,.TXT,.XPS,.PDF,.DOCX,.DOC,.DOCM,.XLSX,.XLS,.XLSM,.PPTX,.PPT,.PPTM,.MSG,.XML,.ODT,.ODS,.ODP,.HTML,.XML,.ZIP,.GZ,.EPUB,.EML,.RTF,.XT,.CSV,.JSON,.7Z,.EMF,.KML,.KMZ,.MDI,.MHT,.MSGT,.ODT,.OFT,.PUB,.RAR,.SVG,.TEXTCLIPPING,.TIF,.TMP,.URL,.WEBARCHIVE,.WEBP,.WMF';

// /** Maximum upload size in bytes */
// const MAX_UPLOAD_SIZE = '26214400';

// /** Maximum number of files uploaded in same segment */
// const MAX_UPLOAD_FILES = 5;

/** Snackbar duration in ms */
const SNACKBAR_DURATION = 3000;

/**
 * Shared documentation service. Handles export and upload documentation.
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentationService {
  /**
   * Shared documentation service. Handles export and upload documentation.
   *
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param restService Shared rest service
   * @param document document
   * @param environment environment data
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
   * @param path download path to append to base url
   * @param fileName download file name
   * @param options (optional) request options
   */
  getFile(path: string, fileName: string, options?: any): void {
    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.download.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;

    this.restService
      .get(path, { ...options, responseType: 'blob', headers })
      .subscribe({
        next: (res) => {
          const blob = new Blob([res]);
          this.saveFile(fileName, blob);
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
    setTimeout(() => link.remove(), 0);
  }

  /**
   * Uploads a file
   *
   * @param file file to upload
   * @param driveId Drive where to upload current file
   * @returns http upload request
   */
  async uploadFile(
    file: any,
    driveId: string = '866da8cf-3d36-43e5-b54a-1d5b1ec2226d'
  ): Promise<any> {
    const { snackBarRef, headers } = this.triggerFileDownloadMessage(
      'common.notifications.file.upload.processing'
    );
    const snackBarSpinner = snackBarRef.instance.nestedComponent;
    const fileStream = await this.transformFileToValidInput(file);
    const body = {
      AssignmentFunction: [2],
      Country: [181, 27, 44, 76, 111, 143, 148, 159, 150],
      DocumentRole: [3],
      Hazard: [10],
      InformationConfidentiality: [1],
      Region: [4],
      FileStream: fileStream,
      FileName: file.name,
    };
    return new Promise((reject, resolve) => {
      this.restService
        .post(
          `${this.environment.csapiUrl}/documents/drives/${driveId}/items`,
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
            resolve(
              `${this.environment.csapiUrl}/documents/drives/${driveId}/items/${itemId}/content`
            );
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
   * Transforms given file value into a valid base 64 input for cs documentation api
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
