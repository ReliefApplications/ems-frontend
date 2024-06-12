import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentUploadComponent {
  @ViewChild('documentUpload') documentUpload: any;

  public documentUploadData = {
    userid: 'eab609d8-b7cb-4753-b989-5c3d17c254e2',
    mode: 'new',
    allowedFileTypes:
      '.BMP,.GIF,.JPG,.JPEG,.PNG,.HTM,.TXT,.XPS,.PDF,.DOCX,.DOC,.DOCM,.XLSX,.XLS,.XLSM,.PPTX,.PPT,.PPTM,.MSG,.XML,.ODT,.ODS,.ODP,.HTML,.XML,.ZIP,.GZ,.EPUB,.EML,.RTF,.XT,.CSV,.JSON,.7Z,.EMF,.KML,.KMZ,.MDI,.MHT,.MSGT,.ODT,.OFT,.PUB,.RAR,.SVG,.TEXTCLIPPING,.TIF,.TMP,.URL,.WEBARCHIVE,.WEBP,.WMF',
    maxUploadSize: '26214400',
    maxUploadFiles: 5,
    baseApiUrl: 'https://ems2-dev.who.int/csapi/api/',
    // baseDocUIUrl: 'http://localhost:1414/docPermissionRules.html',
    // baseUploadPermissionUrl:
    //   'http://localhost:1414/docUploadPermissionRules.html',
    msalConfig: {
      scopes: 'api://75deca06-ae07-4765-85c0-23e719062833/access_as_user',
      userid: 'eab609d8-b7cb-4753-b989-5c3d17c254e2',
      token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJhcGk6Ly83NWRlY2EwNi1hZTA3LTQ3NjUtODVjMC0yM2U3MTkwNjI4MzMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mNjEwYzBiNy1iZDI0LTRiMzktODEwYi0zZGMyODBhZmI1OTAvIiwiaWF0IjoxNzE4MTAyODIyLCJuYmYiOjE3MTgxMDI4MjIsImV4cCI6MTcxODEwNzk4OSwiYWNyIjoiMSIsImFpbyI6IkFaUUFhLzhXQUFBQUJXbnhXM1JkZnZGTFB4dVM5TlZRTzRhblVTUVFwUTlnNjlpVG9MVy9nbnVFMXJQQlRXbTJUckgrMkxURzBKWEpxRnJZRFJncEs0MmYxam8raTd4dDNaMEhRRmdCZFNEelkrUTl5ZFN6RUNQbDZLZnhId083WFRoOFJZNU1rMVVPK2diNGp3L1lkR0srVmhMbk5PczYvcU9laThTdVFPOGdsdkZaMXIzOW5NTkxldXhmeHJsczNBWGMwVzg5TGRySiIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIwMjEyMDJhYy1kMjNiLTQ3NTctODNlMy1mNmVjZGUxMjI2NmIiLCJhcHBpZGFjciI6IjAiLCJlbWFpbCI6ImFudG9pbmVAcmVsaWVmYXBwbGljYXRpb25zLm9yZyIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2ZiYWNkNDhkLWNjZjQtNDgwZC1iYWYwLTMxMDQ4MzY4MDU1Zi8iLCJpcGFkZHIiOiIyYTA0OmNlYzI6MmM6MzdiMDo1MWY5OjY5NWU6ZDk1OTpmYTI3IiwibmFtZSI6IkFudG9pbmUgSHVyYXJkIChhbnRvaW5lQHJlbGllZmFwcGxpY2F0aW9ucy5vcmcpIiwib2lkIjoiZWFiNjA5ZDgtYjdjYi00NzUzLWI5ODktNWMzZDE3YzI1NGUyIiwicmgiOiIwLkFVY0F0OEFROWlTOU9VdUJDejNDZ0stMWtBYkszblVIcm1WSGhjQWo1eGtHS0ROSEFLay4iLCJzY3AiOiJhY2Nlc3NfYXNfdXNlciIsInNpZCI6IjRmNWZhYTdiLWYwZWMtNDZkMy1iM2VjLWJhOTgxZTAxOWQxMyIsInN1YiI6IlI0LTRxSXczMHBXdURDdTN4OHVPTk50VlRvSFhFWC1iekZFbzJ4QThWMG8iLCJ0aWQiOiJmNjEwYzBiNy1iZDI0LTRiMzktODEwYi0zZGMyODBhZmI1OTAiLCJ1bmlxdWVfbmFtZSI6ImFudG9pbmVAcmVsaWVmYXBwbGljYXRpb25zLm9yZyIsInV0aSI6Ilh3cjJMcjFHczBhWUMxUFNOOVlVQUEiLCJ2ZXIiOiIxLjAifQ.XQYAb26yWgmgS53vBhaXKqvm1_BknxNPRYwaGhnRIFi1id74szb3xDBcs926TpzhR1JqZk6UqwlffdrGvWGOLHVn6Ql_PtBy8MNdHGydHNGau_9ZZMeVpdxOFyGVHzryDGXsyQFaWmJeAKh6XlW3h-G3_GMSHNdihcdSlspBakA0dGIX225HzHsbJshqtlxoh7A42h3-NVOMccDr_6RRDrwX7UcENCyPkRP0YSBVh3xuFCTtCC29Debww34_gpbBPQ_uRD8_q7sRI5eifx-0MbIC2bzoZKlIFdwMG5SCFIcw-QnigUGt6jQ69wpug6RYOGlBgzs6fVI56DrcDNHCkg',
      username: 'antoine@reliefapplications.org',
    },
  };

  public onClick() {
    const filterObject = {
      // Occurrence: 'one',
    };
    const uploadEvent = new CustomEvent('documentDataForUpload', {
      detail: { filterObject },
    });
    document.dispatchEvent(uploadEvent);
  }
}
