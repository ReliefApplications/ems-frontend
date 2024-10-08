import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
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

const AUTH_TOKEN = '';

@Component({
  selector: 'doc-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentUploadComponent implements OnInit {
  public documentUploadData = {
    userid: USER_ID,
    mode: 'new',
    allowedFileTypes: ALLOWED_FILE_TYPES,
    maxUploadSize: MAX_UPLOAD_SIZE,
    maxUploadFiles: MAX_UPLOAD_FILES,
    baseApiUrl: BASE_API_URL,
    msalConfig: {
      scopes: AUTH_SCOPES,
      userid: USER_ID,
      token: AUTH_TOKEN,
      username: USERNAME,
    },
  };

  ngOnInit(): void {
    this.loadScript()
      .then(() => {
        console.log('script loaded');
      })
      .catch((error) => console.error('Error loading the script: ', error));
  }

  public onClick() {
    const filterObject = {};
    const uploadEvent = new CustomEvent('documentDataForUpload', {
      detail: { filterObject },
    });
    document.dispatchEvent(uploadEvent);
  }

  // If we can load it by CDN later
  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.type = 'module';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error(`Failed to load script: ${SCRIPT_URL}`));
      document.head.appendChild(script);
    });
  }
}
