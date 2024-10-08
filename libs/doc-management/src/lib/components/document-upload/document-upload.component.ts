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
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJhcGk6Ly83NWRlY2EwNi1hZTA3LTQ3NjUtODVjMC0yM2U3MTkwNjI4MzMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNjEwYzBiNy1iZDI0LTRiMzktODEwYi0zZGMyODBhZmI1OTAvIiwiaWF0IjoxNzI4Mzk3MjM2LCJuYmYiOjE3MjgzOTcyMzYsImV4cCI6MTcyODQwMTY0NiwiYWNyIjoiMSIsImFpbyI6IkFaUUFhLzhZQUFBQVlQZ0ozQVVOV2pKL3dPWEhQenpJdk5mK3dEbjdpNHZxMXdqTjFLMnRyWDhuRFVTUnJGNUhyUnpjbGlPeXp3TEpQQWtINWZqQ1V5OHFvZGd2VGZsd2Y0dEI4aWdIVlluaFpQUVF0ZzVtOENaRlk3NVQrMDE0MlFMNHNJaXp4Z3NDeFZLTkxsVWUvQUNxdzJmWmN1Tzk4NFQxR1VFYmZNbWc1WmhFSzJQUDhOeWV6VXJoZTRoWVVrVFNnYVo1b1NTQiIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIwMjEyMDJhYy1kMjNiLTQ3NTctODNlMy1mNmVjZGUxMjI2NmIiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6ImFudG9pbmVAcmVsaWVmYXBwbGljYXRpb25zLm9yZyIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2ZiYWNkNDhkLWNjZjQtNDgwZC1iYWYwLTMxMDQ4MzY4MDU1Zi8iLCJpcGFkZHIiOiIyYTA0OmNlYzI6MmM6NmZhODo3MGI5OjIyZDA6ZmIwNzoxNGVmIiwibmFtZSI6IkFudG9pbmUgSHVyYXJkIChhbnRvaW5lQHJlbGllZmFwcGxpY2F0aW9ucy5vcmcpIiwib2lkIjoiZWFiNjA5ZDgtYjdjYi00NzUzLWI5ODktNWMzZDE3YzI1NGUyIiwicmgiOiIwLkFVY0F0OEFROWlTOU9VdUJDejNDZ0stMWtBYkszblVIcm1WSGhjQWo1eGtHS0ROSEFLay4iLCJzY3AiOiJhY2Nlc3NfYXNfdXNlciIsInNpZCI6ImRjMjBjZjhmLWNiMTUtNGFmYi1iN2U4LTA2M2VlZWFjNzc1MCIsInN1YiI6IlI0LTRxSXczMHBXdURDdTN4OHVPTk50VlRvSFhFWC1iekZFbzJ4QThWMG8iLCJ0aWQiOiJmNjEwYzBiNy1iZDI0LTRiMzktODEwYi0zZGMyODBhZmI1OTAiLCJ1bmlxdWVfbmFtZSI6ImFudG9pbmVAcmVsaWVmYXBwbGljYXRpb25zLm9yZyIsInV0aSI6ImNPc3I4ek1zVFVHbEJVb1A0aEZ3QUEiLCJ2ZXIiOiIxLjAifQ.uN-2dj9wdYWk9hSbzyH3EZ3wv9h-srxzqCwccZxqdq92-tGCaeztSZPL2RFhtq5Q4EXWpGG831pVGkjh9SGr2vclyp2REDj0FCUN7xiwMzxJQOpoe2Q61TlgMGFmkcMFUN2ZzCjTjTyeihcYAjsG9seabI2tX41Ifa43x_ljaxHRNiAcjsW0Af7Kf1uzGoEqo8JWv-T39VTKKjsIWmEQR8wIPJzM4RYwIteriEzjGSFlY1YUfwOqMjPz34QFA46QXxGDK7ftQIB4HEq-EZINJGc4x5qleLP2xObyjaTD4p7Vucz6uHRrRWnVD7oYjAKI1JmtE7Ieb277elgxeIZeUg';
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
      console.log('Script loaded');
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
      console.log(this.documentConfig);
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
