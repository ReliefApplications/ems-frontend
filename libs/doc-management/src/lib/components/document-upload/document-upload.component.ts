import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/** todo: change, static for testing */
const SCRIPT_URL =
  'https://hems-dev.who.int/csdocui/Scripts/build/docui.esm.js';

/** Allowed file types */ // We may need to allow configuration about that
const ALLOWED_FILE_TYPES =
  '.BMP,.GIF,.JPG,.JPEG,.PNG,.HTM,.TXT,.XPS,.PDF,.DOCX,.DOC,.DOCM,.XLSX,.XLS,.XLSM,.PPTX,.PPT,.PPTM,.MSG,.XML,.ODT,.ODS,.ODP,.HTML,.XML,.ZIP,.GZ,.EPUB,.EML,.RTF,.XT,.CSV,.JSON,.7Z,.EMF,.KML,.KMZ,.MDI,.MHT,.MSGT,.ODT,.OFT,.PUB,.RAR,.SVG,.TEXTCLIPPING,.TIF,.TMP,.URL,.WEBARCHIVE,.WEBP,.WMF';

/** Maximum upload size in bytes */
const MAX_UPLOAD_SIZE = '26214400';

/** Maximum number of files uploaded in same segment */
const MAX_UPLOAD_FILES = 5;

/** todo: change, static for testing */
const BASE_API_URL = 'https://hems-dev.who.int/csapi/api/';

// const AUTH_SCOPES = 'api://75deca06-ae07-4765-85c0-23e719062833/access_as_user';

/** todo: change, static for testing */
const USER_ID = 'eab609d8-b7cb-4753-b989-5c3d17c254e2';
/** todo: change, static for testing */
const USERNAME = 'antoine@reliefapplications.org';

/** Configuration interface for document upload settings. */
interface DocumentUploadConfig {
  userid: string; // check if used
  mode: string;
  allowedFileTypes: string;
  maxUploadSize: string;
  maxUploadFiles: number;
  baseApiUrl: string;
  msalConfig: {
    // scopes: string; -> seems to be useless
    userid: string; // check if used
    token: string;
    username: string; // check if used
  };
}

/** Interface of document configuration */
interface documentConfig {
  Occurrence?: string;
  DocumentType?: number;
  Region?: number[];
  Country?: number[];
  Aetiology?: number[];
  Syndrome?: number[];
  Hazard?: number[];
  ['Disease Condition']?: number[];
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
  @Input() token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCIsImtpZCI6IjNQYUs0RWZ5Qk5RdTNDdGpZc2EzWW1oUTVFMCJ9.eyJhdWQiOiJhcGk6Ly83NWRlY2EwNi1hZTA3LTQ3NjUtODVjMC0yM2U3MTkwNjI4MzMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNjEwYzBiNy1iZDI0LTRiMzktODEwYi0zZGMyODBhZmI1OTAvIiwiaWF0IjoxNzMwMzY2NTIyLCJuYmYiOjE3MzAzNjY1MjIsImV4cCI6MTczMDM3MTgxMCwiYWNyIjoiMSIsImFpbyI6IkFaUUFhLzhZQUFBQWp0Z2VhWS95dkIyd1RhcWRzVHIrb1RLSms3Qkg4Szd5NVZOZStSYmlocUtTTFhoaFloSXlWaWthU1hUbkNDdm9SQWdaTUhQMGxZM1UvK1lLdjJwUVlEbG1VaUxpZ0hXZlY4cVVmN3YxTHRUeXdFLzBlVnNNU2hsZ2ZmVkRoTWFuS044WVZLc3E4bVh3cDl1dHhETXVFMHBuaWhwWGdJODVEY0hvVDU2RHdDTVBXaUd1clZxOURkSEFlZ2plOVUvSiIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIwMjEyMDJhYy1kMjNiLTQ3NTctODNlMy1mNmVjZGUxMjI2NmIiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6ImFudG9pbmVAcmVsaWVmYXBwbGljYXRpb25zLm9yZyIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2ZiYWNkNDhkLWNjZjQtNDgwZC1iYWYwLTMxMDQ4MzY4MDU1Zi8iLCJpcGFkZHIiOiI5MS4xNjMuMTQ3LjIxOSIsIm5hbWUiOiJBbnRvaW5lIEh1cmFyZCAoYW50b2luZUByZWxpZWZhcHBsaWNhdGlvbnMub3JnKSIsIm9pZCI6ImVhYjYwOWQ4LWI3Y2ItNDc1My1iOTg5LTVjM2QxN2MyNTRlMiIsInJoIjoiMS5BVWNBdDhBUTlpUzlPVXVCQ3ozQ2dLLTFrQWJLM25VSHJtVkhoY0FqNXhrR0tETkhBS2xIQUEuIiwic2NwIjoiYWNjZXNzX2FzX3VzZXIiLCJzaWQiOiI4ZWVlZWUwZS00NzczLTRkMGEtOTBlYi1lNDBkNjQwMjlmOTgiLCJzdWIiOiJSNC00cUl3MzBwV3VEQ3UzeDh1T05OdFZUb0hYRVgtYnpGRW8yeEE4VjBvIiwidGlkIjoiZjYxMGMwYjctYmQyNC00YjM5LTgxMGItM2RjMjgwYWZiNTkwIiwidW5pcXVlX25hbWUiOiJhbnRvaW5lQHJlbGllZmFwcGxpY2F0aW9ucy5vcmciLCJ1dGkiOiJvNWRaYkZSSmhVZVpJaEM4MnBVb0FBIiwidmVyIjoiMS4wIn0.dKvu2pymAGeJxRIwaePOqADtGuume87U65_zTHyMzJvr6AZxBtZD-jum1Vt2-O3VVD7Usgd49FP5_xMiwOBAvwSHqyTQKjBPFc2dwEYGohsorfFI3FyIjTZD3rCMlYejK2GLFHkjMykfcCIC75td6C8CeAG7xRsAQ_5b3R4jIoxLRJeXEweNfmtg7O673GiB7iJgU0SxlcA10YxeN80UjlhVZAVkXxJ6rarr_IoRSQ38N-yOx2B083K7KBTInj8NNx5lcHlUF1iVShnapMWqzxaZUPRJIUKJ-4qm2K_KaZLBim11f1pUPCCP4j8PLIbh8V3rv1sBiG6tF1YoWUUhfw';
  /** Document configuration, can set tags by default, document type & occurence */
  @Input() documentConfig: documentConfig = {};
  /** Configuration for document upload web element settings. */
  public uploadConfig: DocumentUploadConfig = {
    userid: USER_ID,
    mode: 'new',
    allowedFileTypes: ALLOWED_FILE_TYPES,
    maxUploadSize: MAX_UPLOAD_SIZE,
    maxUploadFiles: MAX_UPLOAD_FILES,
    baseApiUrl: BASE_API_URL,
    msalConfig: {
      // scopes: AUTH_SCOPES,
      userid: USER_ID,
      token: this.token,
      username: USERNAME,
    },
  };
  /** Is script loading */
  public loading = true;

  async ngOnInit(): Promise<void> {
    try {
      await this.loadScript();
      this.loading = false;
    } catch (error) {
      console.error('Error loading the script: ', error);
    }
  }

  /**
   * Handle click event to dispatch a custom event for document upload.
   */
  public onClick() {
    try {
      const uploadEvent = new CustomEvent('documentDataForUpload', {
        detail: { filterObject: this.documentConfig },
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
