import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  DocumentManagementService,
  CS_DOCUMENTS_PROPERTIES,
} from '../../../../services/document-management/document-management.service';
import { EmailService } from '../../email.service';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { ApiProxyService } from '../../../../services/api-proxy/api-proxy.service';
import { HttpHeaders } from '@angular/common/http';
import { RestService } from '../../../../services/rest/rest.service';
import { set } from 'lodash';
import {
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
  REQUIRED_FILTER_KEYS,
} from '../../constant';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';

/**
 * Attach files to email settings component.
 */
@Component({
  selector: 'app-email-attachment',
  templateUrl: './email-attachment.component.html',
  styleUrls: ['./email-attachment.component.scss'],
})
export class EmailAttachmentComponent implements OnInit {
  /** Property filter to add in upload Api*/
  public bodyFilter: { [key: string]: any[] } = {};
  /** CS Document Properties */
  public properties = CS_DOCUMENTS_PROPERTIES;
  /** PropertyValues */
  public propertyValues = new Map<string, any[]>();
  /** Track if file is selected */
  public isFileSelected = false;
  /** Determines file to be sent as  attachment or URL */
  public sendAsAttachment: boolean | undefined = true;
  /** List of selected file */
  public selectedFiles: string[] = [];
  /** Form group for property selection */
  public propertySelectionForm!: FormGroup;

  /**
   * Email layout page component.
   *
   * @param docManagement Service used for file uploads
   * @param fb Form builder used for form creation
   * @param emailService emailService
   * @param snackbar Snackbar helper function
   * @param translate i18n translate service
   * @param apiProxy Shared API proxy service
   * @param restService Shared REST service
   * @param apollo Apollo service
   * @param environment Environment
   */
  constructor(
    private docManagement: DocumentManagementService,
    private fb: FormBuilder,
    public emailService: EmailService,
    public snackbar: SnackbarService,
    public translate: TranslateService,
    public apiProxy: ApiProxyService,
    public restService: RestService,
    private apollo: Apollo,
    @Inject('environment') private environment: any
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    this.propertySelectionForm = this.fb.group({
      selectedOption: [''],
    });
    this.propertySelectionForm
      .get('selectedOption')
      ?.valueChanges.subscribe((value) => {
        this.updateBodyFilter(value);
      });
  }

  /**
   * Updates the attachment setting based on the upload type.
   *
   * @param {boolean} value - `true` to disable sending as an attachment, `false` to enable it.
   */
  onUploadTypeChange(value: boolean) {
    this.sendAsAttachment = value;
    const currentAttachments =
      this.emailService.datasetsForm.get('attachments')?.value || {};
    currentAttachments.sendAsAttachment = value;

    this.emailService.datasetsForm.patchValue({
      attachments: currentAttachments,
    });
  }

  /**
   * Handles file selection and uploads the file to the drive.
   *
   * @param event - The file input change event.
   * @returns {Promise<any>} Resolves with drive and item IDs or rejects with an error.
   */
  public async onFileSelected(event: Event): Promise<any> {
    if (this.emailService.isQuickAction) {
      this.emailService.disableNextActionBtn = true;
    } else {
      this.emailService.disableSaveAndProceed.next(true);
    }
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      const isValid = this.validateFiles(files);
      if (!isValid) {
        console.error('Validation failed: Check file count and size.');
        return;
      }
      await this.docManagement.getDriveId();
      const driveId = this.docManagement.defaultDriveId;
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      const uploadPromises = files.map(async (file) => {
        const fileStream = await this.docManagement.transformFileToValidInput(
          file
        );
        const url = `${this.environment.csApiUrl}/documents/drives/${driveId}/items`;

        // If send as file
        if (this.sendAsAttachment) {
          this.bodyFilter = {
            DocumentType: [51],
          };
        }
        const body = {
          FileStream: fileStream,
          FileName: file.name,
          ...this.bodyFilter,
        };

        return new Promise((resolve, reject) => {
          this.restService.post(url, body, { headers }).subscribe({
            next: (data: any) => {
              resolve(data);
            },
            error: (error: any) => {
              if (this.emailService.isQuickAction) {
                this.emailService.disableNextActionBtn = false;
              } else {
                this.emailService.disableSaveAndProceed.next(false);
              }
              this.snackbar.openSnackBar(
                this.translate.instant(
                  `common.notifications.email.attachment.uploadFail`,
                  { file: { name: file.name } }
                ),
                {
                  error: true,
                }
              );
              console.error(`File upload failed for ${file.name}`, error);
              reject(null);
            },
          });
        });
      });

      const results = await Promise.all(uploadPromises);

      const uploadedFiles = results.filter((file) => file !== null);

      if (uploadedFiles.length > 0) {
        this.isFileSelected = true;

        const attachments = {
          files: uploadedFiles,
          sendAsAttachment: this.sendAsAttachment,
        };

        // Update the form with the attachments
        this.emailService.datasetsForm.patchValue({
          attachments: attachments,
        });
        if (this.emailService.isQuickAction) {
          this.emailService.disableNextActionBtn = false;
        } else {
          this.emailService.disableSaveAndProceed.next(false);
        }
      } else {
        if (this.emailService.isQuickAction) {
          this.emailService.disableNextActionBtn = false;
        } else {
          this.emailService.disableSaveAndProceed.next(false);
        }
        console.error('All file uploads failed');
      }
    }
  }

  /**
   * Removes file from the attachments at given index.
   *
   * @param {number} index -index of the file to remove.
   */
  removeFile(index: number): void {
    const attachmentsForm = this.emailService.datasetsForm.get('attachments');

    if (attachmentsForm) {
      const files = attachmentsForm.value.files;

      if (files && files.length > 0) {
        files.splice(index, 1);
        attachmentsForm.patchValue({ files });
      }
    }
  }

  /**
   * Loads values for each property in `properties`and stores in `propertyValues`.
   *
   * @returns {Promise<void>} - A promise that resolves when all property values are loaded.
   */
  async loadProperties() {
    for (const property of this.properties) {
      const apolloClient = this.apollo.use('csDocApi');
      const query = gql`
        {
          ${property.value}(sortBy: { field: "name", direction: "asc" }) {
            id
            name
          }
        }
      `;

      try {
        const response: any = await firstValueFrom(
          apolloClient.query<any>({ query })
        );
        const data = response?.data?.[property.value] || [];
        this.propertyValues.set(property.value, data);
      } catch (error) {
        console.error(`Error fetching ${property.text} data:`, error);
      }
    }
  }

  /**
   * Updates the bodyFilter based on the selected option from the dropdown.
   *
   * @param value - The selected dropdown option containing the bodyKey and id.
   */
  updateBodyFilter(value: any): void {
    set(this.bodyFilter, value.bodyKey as string, [value.id]);
  }

  /**
   * Clears the selected option and resets the form field.
   */
  clearSelection() {
    const selectedOption =
      this.propertySelectionForm.get('selectedOption')?.value;
    if (selectedOption && selectedOption.bodyKey) {
      delete this.bodyFilter[selectedOption.bodyKey];
    }
    this.propertySelectionForm.get('selectedOption')?.reset();
  }

  /**
   * Validates selected files based on count and size.
   *
   * @param files - array of files selected for upload.
   * @returns {boolean} - Returns true if the files are valid, otherwise false.
   */
  private validateFiles(files: File[]): boolean {
    const maxFileCount = MAX_FILE_COUNT;
    const maxFileSize = MAX_FILE_SIZE;

    if (!this.sendAsAttachment) {
      const valid = REQUIRED_FILTER_KEYS.every((key) =>
        Object.keys(this.bodyFilter).includes(key)
      );

      if (!valid) {
        this.snackbar.openSnackBar(
          this.translate.instant(`common.notifications.email.errors.noFields`),
          {
            error: true,
          }
        );
      }
    }

    if (files.length > maxFileCount) {
      this.snackbar.openSnackBar(
        this.translate.instant(
          'common.notifications.email.attachment.countValidation',
          { maxFileCount }
        ),
        {
          error: true,
        }
      );
      return false;
    }

    for (const file of files) {
      if (file.size > maxFileSize) {
        this.snackbar.openSnackBar(
          this.translate.instant(
            `common.notifications.email.attachment.sizeValidation`
          ),
          {
            error: true,
          }
        );
        console.error();
        return false;
      }
    }
    return true;
  }
}
