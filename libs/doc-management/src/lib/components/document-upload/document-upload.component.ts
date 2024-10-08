import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

const SCRIPT_URL =
  'https://ems2-dev.who.int/csdocui/Scripts/build/docui.esm.js';

const ALLOWED_FILE_TYPES =
  '.BMP,.GIF,.JPG,.JPEG,.PNG,.HTM,.TXT,.XPS,.PDF,.DOCX,.DOC,.DOCM,.XLSX,.XLS,.XLSM,.PPTX,.PPT,.PPTM,.MSG,.XML,.ODT,.ODS,.ODP,.HTML,.XML,.ZIP,.GZ,.EPUB,.EML,.RTF,.XT,.CSV,.JSON,.7Z,.EMF,.KML,.KMZ,.MDI,.MHT,.MSGT,.ODT,.OFT,.PUB,.RAR,.SVG,.TEXTCLIPPING,.TIF,.TMP,.URL,.WEBARCHIVE,.WEBP,.WMF';

const MAX_UPLOAD_SIZE = '26214400';

const MAX_UPLOAD_FILES = 5;

const BASE_API_URL = 'https://ems2-dev.who.int/csapi/api/';

const AUTH_SCOPES = 'api://75deca06-ae07-4765-85c0-23e719062833/access_as_user';

const USER_ID = 'eab609d8-b7cb-4753-b989-5c3d17c254e2';

const USERNAME = 'antoine@reliefapplications.org';

/** Configuration interface for document upload settings. */
interface DocumentUploadConfig {
  userid: string;
  mode: string;
  allowedFileTypes: string;
  maxUploadSize: string;
  maxUploadFiles: number;
  baseApiUrl: string;
  msalConfig: {
    scopes: string;
    userid: string;
    token: string;
    username: string;
  };
}

/**
 * Document upload component.
 * Uses web element from CS in order to display an upload modal.
 */
@Component({
  selector: 'doc-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentUploadComponent implements OnInit {
  /** Authorization token */
  @Input() token = '';

  /** Configuration for document upload web element settings. */
  public config: DocumentUploadConfig = {
    userid: USER_ID,
    mode: 'new',
    allowedFileTypes: ALLOWED_FILE_TYPES,
    maxUploadSize: MAX_UPLOAD_SIZE,
    maxUploadFiles: MAX_UPLOAD_FILES,
    baseApiUrl: BASE_API_URL,
    msalConfig: {
      scopes: AUTH_SCOPES,
      userid: USER_ID,
      token: this.token,
      username: USERNAME,
    },
  };

  async ngOnInit(): Promise<void> {
    try {
      await this.loadScript();
      console.log('Script loaded');
    } catch (error) {
      console.error('Error loading the script: ', error);
    }
  }

  /**
   * Handle click event to dispatch a custom event for document upload.
   */
  public onClick() {
    try {
      const filterObject = {};
      const uploadEvent = new CustomEvent('documentDataForUpload', {
        detail: { filterObject },
      });
      document.dispatchEvent(uploadEvent);
    } catch (error) {
      console.error('Error during dispatching upload event:', error);
    }
  }

  /**
   * Loads scrip asynchronously.
   *
   * @returns Resolve when script is loaded
   */
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.type = 'module';
      // script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error(`Failed to load script: ${SCRIPT_URL}`));
      document.head.appendChild(script);
    });
  }
}
