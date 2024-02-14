import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { EMAIL_LAYOUT_CONFIG } from '../../../../const/tinymce.const';
import { EditorService } from '../../../../services/editor/editor.service';
import { EmailService } from '../../email.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
/**
 * layout page component.
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
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
  public editor: any = EMAIL_LAYOUT_CONFIG;

  /** HTML content for the body. */
  bodyHtml: any = '';

  /** HTML content for the header. */
  headerHtml: any = '';

  /** HTML content for the footer. */
  footerHtml: any = '';

  /** Text subject for the email. */
  txtSubject: any = '';

  /** Flag indicating whether banner size is invalid. */
  showInvalidBannerSizeMessage = false;

  /** Flag indicating whether header size is invalid. */
  showInvalidHeaderSizeMessage = false;

  /** Flag indicating whether footer size is invalid. */
  showInvalidFooterSizeMessage = false;

  /** Flag indicating whether inputs should be disabled. */
  shouldDisable = false;

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

  /**
   * Component used for the selection of fields to display the fields in tabs.
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
    // Set the editor base url based on the environment file
    this.editor.base_url = editorService.url;
    // Set the editor language
    this.editor.language = editorService.language;
  }

  ngOnInit(): void {
    this.onTxtSubjectChange();
    this.initInTheLastDropdown();
    if (this.emailService.allLayoutdata.headerLogo) {
      if (this.emailService.allLayoutdata.headerLogo.__zone_symbol__value) {
        this.headerLogo = URL.createObjectURL(
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.headerLogo.__zone_symbol__value,
            'image.png',
            'image/png'
          )
        );
      } else {
        this.headerLogo = URL.createObjectURL(
          this.emailService.allLayoutdata.headerLogo
        );
      }
    }

    if (this.emailService.allLayoutdata.footerLogo) {
      if (this.emailService.allLayoutdata.footerLogo.__zone_symbol__value) {
        this.footerLogo = URL.createObjectURL(
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.footerLogo.__zone_symbol__value,
            'image.png',
            'image/png'
          )
        );
      } else {
        this.footerLogo = URL.createObjectURL(
          this.emailService.allLayoutdata.footerLogo
        );
      }
    }

    if (this.emailService.allLayoutdata.bannerImage) {
      if (this.emailService.allLayoutdata.bannerImage.__zone_symbol__value) {
        this.bannerImage = URL.createObjectURL(
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.bannerImage.__zone_symbol__value,
            'image.png',
            'image/png'
          )
        );
      } else {
        this.bannerImage = URL.createObjectURL(
          this.emailService.allLayoutdata.bannerImage
        );
      }
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
  }

  /**
   * Disables or enables save and proceed button based on if subject is empty.
   */
  onTxtSubjectChange(): void {
    if (
      !this.emailService.allLayoutdata.txtSubject ||
      this.emailService.allLayoutdata.txtSubject.trim() === ''
    ) {
      this.showSubjectValidator = true;
    } else {
      this.showSubjectValidator = false;
    }

    if (
      this.emailService.allLayoutdata.txtSubject !== undefined &&
      this.emailService.allLayoutdata.bodyHtml !== undefined
    ) {
      this.shouldDisable =
        !this.emailService.allLayoutdata.txtSubject ||
        this.emailService.allLayoutdata.txtSubject.trim() === '' ||
        this.emailService.allLayoutdata.bodyHtml.trim() === '';
    } else {
      this.shouldDisable = true;
    }

    if (this.shouldDisable) {
      this.emailService.stepperDisable.next({ id: 4, isValid: false });
    } else {
      this.emailService.stepperDisable.next({ id: 4, isValid: true });
    }
    this.emailService.disableSaveAndProceed.next(this.shouldDisable);
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
   * Initialises the in the last dropdown and forms options.
   */
  private initInTheLastDropdown(): void {
    const blocks = this.emailService.datasetsForm.get('dataSets') as FormArray;
    blocks.controls.forEach((blockFormGroup, index) => {
      const blockName =
        blockFormGroup.get('name')?.value || `Block ${index + 1}`;
      const filters = blockFormGroup.get('filter')?.get('filters') as FormArray;
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
   * @param event The position to insert the token.
   */
  insertTokenAtCursor(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptionText =
      selectElement.options[selectElement.selectedIndex].text;
    const [blockName, fieldWithInLast] = selectedOptionText.split(', ');
    const [field, inTheLastText] = fieldWithInLast.split(' - last ');
    const [numberString, unit] = inTheLastText.split(' ');

    const unitInMinutes = this.emailService.convertToMinutes(
      +numberString,
      unit
    );

    const token = `{{${blockName}.${field}.${unitInMinutes}}}`;

    if (this.headerEditor && this.headerEditor.editor) {
      this.headerEditor.editor.insertContent(token);
    } else {
      console.error('Header TinyMCE editor is not initialised');
    }
  }

  /**
   * Initialises the field select dropdown.
   */
  initialiseFieldSelectDropdown(): void {
    const firstBlock = this.emailService.getAllPreviewData()[0];
    if (firstBlock && firstBlock.dataList && firstBlock.dataList.length > 0) {
      this.firstBlockFields = Object.keys(firstBlock.dataList[0]);
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
            this.translate.instant('components.email.image.squareValidation')
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
            this.translate.instant('components.email.image.rectangleValidation')
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
            this.translate.instant('components.email.image.squareValidation')
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
  insertDataSetToBodyHtmlByTabName(tabName: any): void {
    const token = `{{${tabName.target.value}}}`;

    if (
      this.bodyEditor &&
      this.bodyEditor.editor &&
      tabName.target.value !== ''
    ) {
      this.bodyEditor.editor.insertContent(token);
      this.onEditorContentChange();
    } else {
      console.error('Body TinyMCE editor is not initialised');
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
   * @param event The event object containing the selected field.
   */
  insertSubjectFieldToken(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    if (value) {
      const subjectInput = document.getElementById(
        'subjectInput'
      ) as HTMLInputElement;
      if (subjectInput) {
        const cursorPos =
          subjectInput.selectionStart ?? subjectInput.value.length;
        const textBefore = subjectInput.value.substring(0, cursorPos);
        const textAfter = subjectInput.value.substring(cursorPos);
        subjectInput.value = textBefore + value + textAfter;

        // Trigger the input event to ensure ngModel updates
        const inputEvent = new Event('input', { bubbles: true });
        subjectInput.dispatchEvent(inputEvent);
        selectElement.value = '';
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
    if (this.emailService.allLayoutdata.bodyHtml === '') {
      this.showBodyValidator = true;
    } else {
      this.showBodyValidator = false;
    }

    this.onTxtSubjectChange();
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

    this.emailService.headerBackgroundColor = colors.headerBackground;
    this.emailService.headerTextColor = colors.headerColor;
    this.emailService.bodyBackgroundColor = colors.bodyBackground;
    this.emailService.bodyTextColor = colors.bodyColor;
    this.emailService.footerBackgroundColor = colors.footerBackground;
    this.emailService.footerTextColor = colors.footerColor;
    return colors;
  }

  /**
   * patch the data in service file.
   */
  ngOnDestroy(): void {
    this.getColors();
    this.emailService.patchEmailLayout();
  }
}
