import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { EMAIL_LAYOUT_EDITOR_CONFIG } from '../../../../const/tinymce.const';
import { EditorService } from '../../../../services/editor/editor.service';
import { EmailService } from '../../email.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import convertToMinutes from '../../../../utils/convert-to-minutes';
import { COMMA, ENTER, SPACE, TAB } from '@angular/cdk/keycodes';

/**
 * Email layout page component.
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Reference to the body editor component. */
  @ViewChild('bodyEditor', { static: false })
  bodyEditor: EditorComponent | null = null;
  /** Reference to the header editor component. */
  @ViewChild('headerEditor', { static: false })
  headerEditor: EditorComponent | null = null;
  /** Reference to the header logo input element. */
  @ViewChild('headerLogoInput', { static: false })
  headerLogoInput?: ElementRef;
  /** Reference to the footer logo input element. */
  @ViewChild('footerLogoInput', { static: false })
  footerLogoInput?: ElementRef;
  /** Reference to the banner input element. */
  @ViewChild('bannerInput', { static: false })
  bannerInput?: ElementRef;
  /** Flag indicating whether body validation is shown. */
  showBodyValidator = false;
  /** Flag indicating whether subject validation is shown. */
  showSubjectValidator = false;
  /** Configuration object for the Tinymce editor. */
  public editor: any = EMAIL_LAYOUT_EDITOR_CONFIG;
  /** HTML content for the body. */
  bodyHtml: any = '';
  /** HTML content for the header. */
  headerHtml: any = '';
  /** HTML content for the footer. */
  footerHtml: any = '';
  /** Text subject for the email. */
  txtSubject: any = '';
  /** Message indicating whether banner size is invalid. */
  showInvalidBannerSizeMessage = false;
  /** Message indicating whether header size is invalid. */
  showInvalidHeaderSizeMessage = false;
  /** Message indicating whether footer logo size is invalid. */
  showInvalidFooterSizeMessage = false;
  /** Flag indicating whether save and proceed button should be disabled. */
  shouldDisable = true;
  /** Image data for the email header. */
  headerLogo: string | ArrayBuffer | null = null;
  /** Image data for the email banner. */
  bannerImage: string | ArrayBuffer | null = null;
  /** Image data for the email footer. */
  footerLogo: string | ArrayBuffer | null = null;
  /** Flag indicating whether dropdown is shown. */
  showDropdown = false;
  /** List of fields for the first block. */
  firstBlockFields: string[] = [];
  /** Form group for the layout form. */
  layoutForm!: FormGroup;
  /** Options for time in the email. */
  timeOptions = [
    { value: '{{today.date}}', label: "Today's Date" },
    { value: '{{now.time}}', label: 'Current Time' },
    { value: '{{now.datetime}}', label: 'Date and Time' },
  ];
  /** Flag indicating whether layout validation is set. */
  @Input() setLayoutValidation = false;
  /** Form array for 'in the last' dropdown. */
  public inTheLastDropdown = new FormArray<FormControl>([]);
  /** DATASETS LIST GREATER THAN 1 CHECK */
  public datasetOverflow = false;
  /** Subscription for the graphql load change event. */
  private loadChangeSubscription: Subscription = new Subscription();

  /** To input HTML */
  @ViewChild('toInput') toInput!: ElementRef<HTMLInputElement>;
  /** Cc input HTML */
  @ViewChild('ccInput') ccInput!: ElementRef<HTMLInputElement>;
  /** Bcc input HTML */
  @ViewChild('bccInput') bccInput!: ElementRef<HTMLInputElement>;
  /** Regex pattern for email */
  EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  /** Key codes of separators */
  SEPARATOR_KEYS_CODE = [ENTER, COMMA, TAB, SPACE];

  /** @returns list of emails */
  get emails(): string[] {
    return this.layoutForm.get('to')?.value || [];
  }

  /** @returns {string[]} An array containing the CC values.*/
  get cc(): string[] {
    return this.layoutForm.get('cc')?.value || [];
  }

  /** @returns {string[]} An array containing the BCC values. */
  get bcc(): string[] {
    return this.layoutForm.get('bcc')?.value || [];
  }

  /** @returns error message */
  get emailsError(): string {
    const control = this.layoutForm.get('to');
    if (control?.hasError('required')) {
      return 'components.distributionLists.errors.emails.required';
    }
    if (control?.hasError('pattern')) {
      return 'components.distributionLists.errors.emails.pattern';
    }
    return '';
  }

  /** separatorKeysCodes  */
  readonly separatorKeysCodes: number[] = this.SEPARATOR_KEYS_CODE;
  /** flag for custom preview template  */
  @Input() isPreviewTemplate = false;

  /**
   * Email layout page component.
   *
   * @param fb Form builder used for form creation
   * @param editorService Editor service used to get main URL and current language
   * @param emailService Service used for email-related operations and state management
   * @param snackbar snackbar helper function
   * @param translate i18 translate service
   */
  constructor(
    private fb: FormBuilder,
    private editorService: EditorService,
    public emailService: EmailService,
    public snackbar: SnackbarService,
    public translate: TranslateService
  ) {
    super();
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    if (this.emailService.isQuickAction) {
      this.emailService.resetPreviewData();
      this.emailService.previewData.datasets = ['Block 1'];
    } else {
      this.emailService.createPreviewData();
    }

    if (!this.emailService.isCustomTemplateEdit) {
      this.emailService.allLayoutdata.bodyHtml =
        this.emailService.isQuickAction &&
        this.emailService.allLayoutdata?.bodyHtml?.trim() === ''
          ? '<p>{{Block 1}}</p>'
          : this.emailService.allLayoutdata.bodyHtml;
      this.layoutForm = this.fb.group({
        subjectField: [''],
        timeInput: [''],
        subjectInput: [this.emailService.allLayoutdata.txtSubject],
        inTheLastDropdown: [''],
        headerTimeInput: [''],
        header: [this.emailService.allLayoutdata.headerHtml],
        block: [''],
        body: [this.emailService.allLayoutdata.bodyHtml],
        to: [''],
        cc: [''],
        bcc: [''],
      });
    } else {
      this.layoutForm = this.fb.group({
        subjectField: [''],
        timeInput: [''],
        subjectInput: [
          this.emailService.datasetsForm?.get('emailLayout')?.value.subject,
        ],
        inTheLastDropdown: [''],
        headerTimeInput: [''],
        header: [
          this.emailService.datasetsForm?.get('emailLayout')?.value?.header
            ?.headerHtml,
        ],
        block: [''],
        body: [
          this.emailService.datasetsForm?.get('emailLayout')?.value?.body
            ?.bodyHtml,
        ],
      });
      if (this.emailService.isQuickAction) {
        const dlForm = this.fb.group({
          ...this.layoutForm,
          to: [''],
          cc: [''],
          bcc: [''],
        });
        this.layoutForm.patchValue(dlForm);
      }
    }

    this.onTxtSubjectChange();
    this.initInTheLastDropdown();
    if (this.emailService.allLayoutdata.headerLogo) {
      this.headerLogo = this.emailService.allLayoutdata.headerLogo;
    }

    if (this.emailService.allLayoutdata.footerLogo) {
      this.footerLogo = this.emailService.allLayoutdata.footerLogo;
    }

    if (this.emailService.allLayoutdata.bannerImage) {
      this.bannerImage = this.emailService.allLayoutdata.bannerImage;
    }
    this.initialiseFieldSelectDropdown();
    if (this.headerLogoInput) {
      if (this.emailService.allLayoutdata.headerLogo) {
        this.headerLogoInput.nativeElement.value =
          this.emailService.allLayoutdata.headerLogo;
      }
    }
    if (this.bannerInput) {
      if (this.emailService.allLayoutdata.bannerImage) {
        this.bannerInput.nativeElement.value =
          this.emailService.allLayoutdata.bannerImage;
      }
    }
    if (this.footerLogoInput) {
      if (this.emailService.allLayoutdata.footerLogo) {
        this.footerLogoInput.nativeElement.value =
          this.emailService.allLayoutdata.footerLogo;
      }
    }
    if (this.emailService.emailDistributionList.to) {
      this.layoutForm
        .get('to')
        ?.setValue(this.emailService.emailDistributionList.to);
    }
    if (this.emailService.emailDistributionList.cc) {
      this.layoutForm
        .get('cc')
        ?.setValue(this.emailService.emailDistributionList.cc);
    }
    if (this.emailService.emailDistributionList.bcc) {
      this.layoutForm
        .get('bcc')
        ?.setValue(this.emailService.emailDistributionList.bcc);
    }
  }

  /**
   * Disables or enables save and proceed button based on if subject is empty.
   */
  onTxtSubjectChange(): void {
    this.emailService.disableSaveAndProceed.next(true);
    this.showSubjectValidator =
      !this.layoutForm.controls['subjectInput'].value ||
      this.layoutForm.controls['subjectInput'].value.trim() === '';

    // this.emailService.allLayoutdata.txtSubject =
    //   this.layoutForm.controls['subjectInput'].value;

    if (
      this.layoutForm.controls['subjectInput'].touched &&
      this.showSubjectValidator
    ) {
      this.snackbar.openSnackBar(
        this.translate.instant('common.notifications.email.errors.noSubject'),
        {
          error: true,
        }
      );
      if (this.emailService.isQuickAction && !this.showBodyValidator) {
        this.emailService.disableNextActionBtn = true;
      }
    }
    this.emailService.allLayoutdata.txtSubject =
      this.layoutForm.controls['subjectInput'].value;

    const bodyHtml = this.layoutForm.get('body')?.value;
    let isUndefined = !bodyHtml;
    if (bodyHtml) {
      isUndefined =
        /^<p>\s*<\/p>$/.test(bodyHtml.trim()) ||
        /^<p>(&nbsp;)*<\/p>$/.test(bodyHtml.trim()) ||
        bodyHtml.trim() === '' ||
        bodyHtml === '<p></p>';
    }

    this.showBodyValidator = isUndefined;
    let checkDuplicateName = false;
    if (
      this.emailService.customTemplateNames.includes(
        this.emailService.layoutTitle.trim().toLowerCase()
      ) &&
      !this.emailService.isCustomTemplateEdit
    ) {
      checkDuplicateName = true;
    }
    if (
      this.showSubjectValidator ||
      this.showBodyValidator ||
      (checkDuplicateName && this.emailService.isQuickAction)
    ) {
      this.emailService.disableSaveAndProceed.next(true);
      this.emailService.stepperDisable.next({ id: 4, isValid: false });
      this.emailService.disableNextActionBtn = true;
    } else {
      this.emailService.disableSaveAndProceed.next(false);
      this.emailService.stepperDisable.next({ id: 4, isValid: true });
      this.emailService.disableNextActionBtn = false;
    }
  }

  /**
   * Replaces in the last token,
   */
  replaceInLastToken(): void {
    const inTheLastValue = this.emailService.datasetsForm
      .get('filter')
      ?.value?.filters.find(
        (filter: any) => filter.operator === 'inthelast'
      )?.value;
    if (inTheLastValue) {
      const token = '{{dataset.filter.field.value}}';
      this.headerHtml = this.headerHtml.replace(token, inTheLastValue);
    }
  }

  /**
   * Initializes the in the last dropdown and forms options.
   */
  private initInTheLastDropdown(): void {
    const blocks = this.emailService.datasetsForm.get('datasets') as FormArray;
    blocks.controls.forEach((blockFormGroup: any, index) => {
      const blockName =
        blockFormGroup.get('name')?.value || `Block ${index + 1}`;
      const filters = blockFormGroup
        .get('query')
        .get('filter')
        .get('filters') as FormArray;
      filters.controls.forEach((filterControl) => {
        if (filterControl.get('operator')?.value === 'inthelast') {
          const field = filterControl.get('field')?.value;
          const number = filterControl.get('inTheLast.number')?.value;
          const unit = filterControl.get('inTheLast.unit')?.value;
          const option = `${blockName}, ${field} - last ${number} ${unit}`;
          this.inTheLastDropdown.push(new FormControl(option));
        }
      });
    });
  }

  /**
   * Inserts token at cursor position.
   *
   * @param tokenType The input type of form element
   * @param event The value of the form element
   */
  insertTokenAtCursor(tokenType: string, event: string): void {
    if (event) {
      // Builds Token based on the tokenType
      let token = '';
      if (tokenType === 'time') {
        token = ` ${event} `;
      } else if (tokenType === 'inTheLast') {
        // Converts dropdown label to token
        const [blockName, fieldWithInLast] = event.split(', ');
        const [field, inTheLastText] = fieldWithInLast.split(' - last ');
        const [numberString, unit] = inTheLastText.split(' ');

        // Converts in the last value to minutes
        const unitInMinutes = convertToMinutes(+numberString, unit);

        // Builds Token
        token = ` {{${blockName}.${field}.${unitInMinutes}}} `;
      }
      // Inserts Token and resets dropdown value
      if (this.headerEditor && this.headerEditor.editor) {
        // Get the current range of the editor
        const range = this.headerEditor.editor.selection.getRng();

        // Get the current cursor position as a number
        const cursorPosition = range.startOffset;

        // Get the current content of the editor
        const currentContent = this.headerEditor.editor.getContent();
        this.headerEditor.editor.selection.select(
          this.headerEditor.editor.getBody(),
          true
        );
        this.headerEditor.editor.selection.collapse(false);
        // Check if the cursor is at the beginning or end of the content
        if (cursorPosition === 0) {
          // If at the beginning, remove the leading whitespace from the token
          this.headerEditor.editor.insertContent(token.trimStart());
        } else if (cursorPosition === currentContent.length) {
          // If at the end, remove the trailing whitespace from the token
          this.headerEditor.editor.insertContent(token.trimEnd());
        } else {
          // If in the middle, insert the token with spaces before and after it
          this.headerEditor.editor.execCommand(
            'mceInsertContent',
            false,
            token
          );
        }

        // Reset the dropdown value
        if (tokenType === 'time') {
          this.layoutForm.get('headerTimeInput')?.reset();
        } else if (tokenType === 'inTheLast') {
          this.layoutForm.get('inTheLastDropdown')?.reset();
        }

        this.layoutForm
          .get('header')
          ?.setValue(this.headerEditor.editor.getContent());

        this.emailService.allLayoutdata.headerHtml =
          this.layoutForm.get('header')?.value;
      } else {
        console.error('Header TinyMCE editor is not initialised');
      }
    }
  }

  /**
   * Initializes the field select dropdown.
   */
  initialiseFieldSelectDropdown(): void {
    const firstBlock = this.emailService.getAllPreviewData()[0];
    if (
      firstBlock?.datasetFields?.length > 0 ||
      this.emailService.previewData.fields?.length > 0
    ) {
      // get the values of the first block
      this.firstBlockFields =
        this.emailService.previewData?.fields ??
        Object.values(firstBlock.datasetFields);
    }
  }

  /**
   * This method handles the selection of the header logo.
   *
   * @param event - The event triggered when a header logo is selected.
   */
  onHeaderLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateSquareImageSize(file)
        .then(() => {
          this.showInvalidHeaderSizeMessage = false;
          const reader = new FileReader();
          reader.onload = () => (this.headerLogo = reader.result);
          reader.readAsDataURL(file);
          this.emailService.onHeaderLogoSelected(file);
        })
        .catch((error) => {
          this.showInvalidHeaderSizeMessage = true;
          console.error(error.message);
          this.snackbar.openSnackBar(
            this.translate.instant('components.email.image.squareValidation'),
            { error: true }
          );
          if (this.headerLogoInput && this.headerLogoInput.nativeElement) {
            if (this.emailService.allLayoutdata.headerLogo) {
              this.headerLogoInput.nativeElement.value =
                this.emailService.allLayoutdata.headerLogo;
            } else {
              this.headerLogoInput.nativeElement.value = null;
            }
          }
        });
    }
  }

  /**
   * Removes the header logo from users selection.
   */
  removeHeaderLogo() {
    this.headerLogo = null;
    this.emailService.allLayoutdata.headerLogo = null;
    if (this.headerLogoInput && this.headerLogoInput.nativeElement) {
      this.headerLogoInput.nativeElement.value = null;
    }
  }

  /**
   * This method handles the selection of the Banner Image.
   *
   * @param event - The event triggered when a Banner Image is selected.
   */
  onBannerSelected(event: any): void {
    const file = event.target.files[0];
    // const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.validateBannerImageSize(file)
        .then(() => {
          const reader = new FileReader();
          reader.onload = () => (this.bannerImage = reader.result);
          reader.readAsDataURL(file);
          this.emailService.onBannerSelected(file);
        })
        .catch((error) => {
          console.error(error.message);
          this.snackbar.openSnackBar(
            this.translate.instant(
              'components.email.image.rectangleValidation'
            ),
            { error: true }
          );
          if (this.bannerInput && this.bannerInput.nativeElement) {
            if (this.emailService.allLayoutdata.bannerImage) {
              this.bannerInput.nativeElement.value =
                this.emailService.allLayoutdata.bannerImage;
            } else {
              this.bannerInput.nativeElement.value = null;
            }
          }
        });
    }
  }

  /**
   * Validates banner image size.
   *
   * @param file - The image file to be validated.
   */
  validateBannerImageSize(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio >= 3 && aspectRatio <= 16) {
          resolve();
        } else {
          reject(new Error('Invalid image size'));
        }
      };
      img.onerror = () => reject(new Error('Error loading image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Removes the banner image from users selection.
   */
  removeBannerImage() {
    this.bannerImage = null;
    this.emailService.allLayoutdata.bannerImage = null;
    if (this.bannerInput && this.bannerInput.nativeElement) {
      this.bannerInput.nativeElement.value = null;
    }
  }

  /**
   * This method handles the selection of the footer logo.
   *
   * @param event - The event triggered when a footer logo is selected.
   */
  onFooterLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateSquareImageSize(file)
        .then(() => {
          this.showInvalidFooterSizeMessage = false;
          const reader = new FileReader();
          reader.onload = () => (this.footerLogo = reader.result);
          reader.readAsDataURL(file);
          this.emailService.onFooterLogoSelected(file);
        })
        .catch((error) => {
          this.showInvalidFooterSizeMessage = true;
          console.error(error.message);
          this.snackbar.openSnackBar(
            this.translate.instant('components.email.image.squareValidation'),
            { error: true }
          );
          if (this.footerLogoInput && this.footerLogoInput.nativeElement) {
            if (this.emailService.allLayoutdata.footerLogo) {
              this.footerLogoInput.nativeElement.value =
                this.emailService.allLayoutdata.footerLogo;
            } else {
              this.footerLogoInput.nativeElement.value = null;
            }
          }
        });
    }
  }

  /**
   * Removes the footer logo from users selection.
   */
  removeFooterLogo() {
    this.footerLogo = null;
    this.emailService.allLayoutdata.footerLogo = null;
    if (this.footerLogoInput && this.footerLogoInput.nativeElement) {
      this.footerLogoInput.nativeElement.value = null;
    }
  }

  /**
   * Validates Square images.
   *
   * @param file - The image file to be validated.
   */
  validateSquareImageSize(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (aspectRatio >= 0.95 && aspectRatio <= 1.05) {
          // Adjust this range as needed
          resolve();
        } else {
          reject(new Error('Invalid image size'));
        }
      };
      img.onerror = () => reject(new Error('Error loading image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Inserts a dataset token into the body HTML based on the provided tab name.
   *
   * @param tabName The name of the tab to insert the dataset token for.
   */
  insertDataSetToBodyHtmlByTabName(tabName: string): void {
    if (tabName) {
      const token = `{{${tabName}}}`;

      if (this.bodyEditor && this.bodyEditor.editor) {
        this.bodyEditor.editor.selection.select(
          this.bodyEditor.editor.getBody(),
          true
        );
        this.bodyEditor.editor.selection.collapse(false);
        this.bodyEditor.editor.insertContent(token);
        this.layoutForm
          .get('body')
          ?.setValue(this.bodyEditor.editor.getContent());
      } else {
        console.error('Body TinyMCE editor is not initialised');
      }
      // Resets Block dropdown value to blank
      this.layoutForm.get('block')?.reset();

      // Trigger the content change event to update the editor and perform validation
      this.onEditorContentChange();
    }
  }

  /**
   * Checks that theres only 1 dataset row and returns the fields in that row if so.
   *
   * @returns The fields in the dataset, else null.
   */
  checkSingleDatasetRow(): string[] | null {
    if (
      this.emailService.allPreviewData.length === 1 &&
      this.emailService.allPreviewData[0].dataList &&
      this.emailService.allPreviewData[0].dataList.length === 1 &&
      Object.keys(this.emailService.allPreviewData[0].dataList[0]).length === 1
    ) {
      // Return the fields from the single row of data
      return Object.keys(this.emailService.allPreviewData[0].dataList[0]);
    }
    return null;
  }

  /**
   * Inserts a dataset token into the subject field based on the selected field.
   *
   * @param control The control to take the token from.
   * @param inputRef The input element, to insert the token into.
   */
  insertSubjectFieldToken(control: string, inputRef: HTMLInputElement): void {
    const value =
      control === 'field' || control === 'time'
        ? control === 'field'
          ? this.layoutForm.get('subjectField')?.value
          : this.layoutForm.get('timeInput')?.value
        : '';

    if (value) {
      // Get the current value of the subjectInput FormControl
      let subjectInput = this.layoutForm.get('subjectInput')?.value;
      if (subjectInput) {
        // Get the cursor position
        const cursorPos = inputRef.selectionStart ?? subjectInput.length;
        // Split the current value at the cursor position
        const textBefore = subjectInput.substring(0, cursorPos);
        const textAfter = subjectInput.substring(cursorPos);
        // Insert the value at the cursor position
        subjectInput = textBefore + ' ' + value + ' ' + textAfter;
        // Update the FormControl value
        this.layoutForm.get('subjectInput')?.setValue(subjectInput.trim());
        this.emailService.allLayoutdata.txtSubject =
          this.layoutForm.get('subjectInput')?.value;
        // Clear the select element value
        if (control === 'field') {
          this.layoutForm.get('subjectField')?.reset();
        } else if (control === 'time') {
          this.layoutForm.get('timeInput')?.reset();
        }
      } else {
        // Update the FormControl value
        this.layoutForm.get('subjectInput')?.setValue(value);
        this.emailService.allLayoutdata.txtSubject =
          this.layoutForm.get('subjectInput')?.value;
        // Clear the select element value
        if (control === 'field') {
          this.layoutForm.get('subjectField')?.reset();
        } else if (control === 'time') {
          this.layoutForm.get('timeInput')?.reset();
        }
      }
    }
  }

  /**
   * Replaces the email service subject with the provided value by the user.
   *
   * @param event The txtSubject html input element.
   */
  updateEmailServiceSubject(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.emailService.allLayoutdata.txtSubject = inputElement.value;
  }

  /**
   * Handles changes to the editor content and updates the layout data accordingly.
   */
  onEditorContentChange(): void {
    const bodyHtml = this.layoutForm.get('body')?.value;
    let isUndefined = !bodyHtml;
    if (bodyHtml) {
      isUndefined =
        /^<p>\s*<\/p>$/.test(bodyHtml.trim()) ||
        /^<p>(&nbsp;)*<\/p>$/.test(bodyHtml.trim()) ||
        bodyHtml.trim() === '' ||
        bodyHtml === '<p></p>';
    }

    this.showBodyValidator = isUndefined;
    if (this.showBodyValidator) {
      this.onTxtSubjectChange();
      this.snackbar.openSnackBar(
        this.translate.instant('common.notifications.email.errors.noBody'),
        { error: true }
      );
    } else if (this.layoutForm.get('body')?.touched) {
      if (isUndefined) {
        this.showBodyValidator = true;
        this.snackbar.openSnackBar(
          this.translate.instant('common.notifications.email.errors.noBody'),
          { error: true }
        );
      }
      this.onTxtSubjectChange();
    } else {
      this.showBodyValidator = false;
      this.onTxtSubjectChange();
    }
  }

  /**
   * This method retrieves the color values from the form.
   *
   * @returns An object containing color values.
   */
  getColors() {
    const colors = {
      headerBackground: (
        document.getElementById('headerBackgroundColor') as HTMLInputElement
      ).value,
      headerColor: (document.getElementById('headerColor') as HTMLInputElement)
        .value,
      bodyBackground: (
        document.getElementById('bodyBackgroundColor') as HTMLInputElement
      ).value,
      bodyColor: (document.getElementById('bodyColor') as HTMLInputElement)
        .value,
      footerBackground: (
        document.getElementById('footerBackgroundColor') as HTMLInputElement
      ).value,
      footerColor: (document.getElementById('footerColor') as HTMLInputElement)
        .value,
    };

    this.emailService.allLayoutdata.headerBackgroundColor =
      colors.headerBackground;
    this.emailService.allLayoutdata.headerTextColor = colors.headerColor;
    this.emailService.allLayoutdata.bodyBackgroundColor = colors.bodyBackground;
    this.emailService.allLayoutdata.bodyTextColor = colors.bodyColor;
    this.emailService.allLayoutdata.footerBackgroundColor =
      colors.footerBackground;
    this.emailService.allLayoutdata.footerTextColor = colors.footerColor;
    return colors;
  }

  /**
   * patch the data in service file.
   */
  override ngOnDestroy(): void {
    this.getColors();
    this.emailService.allLayoutdata.txtSubject =
      this.layoutForm.get('subjectInput')?.value;
    this.emailService.allLayoutdata.bodyHtml =
      this.layoutForm.get('body')?.value;
    this.emailService.allLayoutdata.headerHtml =
      this.layoutForm.get('header')?.value;
    // this.emailService.patchEmailLayout();
  }

  /**
   * Add the inputs emails to the distribution list
   *
   * @param emailType The type of the email (to, cc, bcc)
   * @param event The event triggered when we exit the input
   */
  addEmail(emailType: string, event: string | any): void {
    const control = this.layoutForm.get(emailType);
    // use setTimeout to prevent add input value on focusout
    setTimeout(
      () => {
        const value: string =
          event.type === 'focusout' ? this.toInput.nativeElement.value : event;

        // Add the mail
        const emails =
          emailType === 'to'
            ? [...this.emails]
            : emailType === 'cc'
            ? [...this.cc]
            : [...this.bcc];
        if ((value || '').trim()) {
          if (this.EMAIL_REGEX.test(value.trim())) {
            emails.push(value.trim());
            const uniqueEmails = Array.from(new Set(emails));
            control?.patchValue(uniqueEmails);
            control?.updateValueAndValidity();
            if (event.type === 'focusout') {
              switch (emailType) {
                case 'to':
                  this.toInput.nativeElement.value = '';
                  break;
                case 'cc':
                  this.ccInput.nativeElement.value = '';
                  break;
                case 'bcc':
                  this.bccInput.nativeElement.value = '';
                  break;
                default:
                  break;
              }
            }
          } else {
            control?.setErrors({ pattern: true });
          }
        } else {
          // no value
          control?.setErrors({ pattern: false });
          control?.updateValueAndValidity();
        }
        this.emailService.emailDistributionList =
          this.emailService.emailDistributionList === undefined
            ? {}
            : this.emailService.emailDistributionList;
        switch (emailType) {
          case 'to':
            this.emailService.emailDistributionList.to = emails;
            break;
          case 'cc':
            this.emailService.emailDistributionList.cc = emails;
            break;
          case 'bcc':
            this.emailService.emailDistributionList.bcc = emails;
            break;
          default:
            break;
        }
      },
      event.type === 'focusout' ? 500 : 0
    );
  }

  /**
   * Remove an email from the distribution list
   *
   * @param email The email to remove
   * @param type the type as string
   */
  removeEmail(email: string, type: string): void {
    if (type === 'to') {
      const emails = [...this.emails].filter(
        (emailData) => emailData.toLowerCase() !== email.toLowerCase()
      );
      this.layoutForm.get(type)?.setValue(emails);
      this.emailService.emailDistributionList.to = emails;
    }
    if (type === 'cc') {
      const emails = [...this.cc].filter(
        (emailData) => emailData.toLowerCase() !== email.toLowerCase()
      );
      this.layoutForm.get(type)?.setValue(emails);
      this.emailService.emailDistributionList.cc = emails;
    }
    if (type === 'bcc') {
      const emails = [...this.bcc].filter(
        (emailData) => emailData.toLowerCase() !== email.toLowerCase()
      );
      this.layoutForm.get(type)?.setValue(emails);
      this.emailService.emailDistributionList.bcc = emails;
    }
  }
}
