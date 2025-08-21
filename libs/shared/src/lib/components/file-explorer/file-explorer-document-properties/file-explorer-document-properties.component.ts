import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetDocumentByIdResponse } from '../../../services/document-management/graphql/queries';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { DocumentManagementService } from '../../../services/document-management/document-management.service';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerModule } from '@oort-front/ui';
import { FileExplorerDocumentToolbarComponent } from '../file-explorer-document-toolbar/file-explorer-document-toolbar.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Component to display the properties of a document in the file explorer.
 * It takes the document properties as input and formats them for display.
 */
@Component({
  selector: 'shared-file-explorer-document-properties',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerModule,
    FileExplorerDocumentToolbarComponent,
    TranslateModule,
  ],
  templateUrl: './file-explorer-document-properties.component.html',
  styleUrls: ['./file-explorer-document-properties.component.scss'],
})
export class FileExplorerDocumentPropertiesComponent
  extends UnsubscribeComponent
  implements OnChanges
{
  /** Document ID to fetch properties for */
  @Input() documentId!: string;
  /** Loading state */
  public loading = false;
  /** Document properties, formatted for display */
  public document?: {
    id: string;
    filename: string;
    informationconfidentialityname?: string;
    documentcategoryname?: string;
    languagename?: string;
    sourceofinformationname?: string;
    ihrcommunicationname?: string;
    diseasecondition?: string;
    aetiology?: string;
    syndrome?: string;
    hazard?: string;
    country?: string;
    region?: string;
    createddate?: string;
    createdbyuser?: string;
    createdbyuseremail?: string;
    modifieddate?: string;
    modifiedbyuser?: string;
    modifiedbyuseremail?: string;
    size?: number;
    version?: string;
    documenttypename?: string;
    occurrence?: string;
    documentrolename?: string;
    imsfunctionname?: string;
    occurrencetype?: string;
    driveid?: string;
  };
  /** Document management service */
  private documentManagementService = inject(DocumentManagementService);
  /** Subject to cancel previous requests */
  private cancelPreviousRequest$ = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentId'] && this.documentId) {
      this.fetchDocumentProperties();
    }
  }

  /**
   * Fetches the properties of the document by its ID.
   */
  public fetchDocumentProperties(): void {
    if (!this.documentId) return;

    // Cancel any previous request
    this.cancelPreviousRequest$.next();

    this.loading = true;
    this.document = undefined;

    // Cancel previous request when documentId changes
    this.documentManagementService
      .getDocumentProperties(this.documentId)
      .pipe(takeUntil(this.cancelPreviousRequest$), takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.formatDocument(data);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching document properties:', error);
          this.loading = false;
        },
      });
  }

  /**
   * Formats the document properties from the GraphQL response, to display in the UI
   *
   * @param queryResult GraphQL response containing document properties.
   */
  formatDocument(queryResult: GetDocumentByIdResponse) {
    const versions = queryResult.properties.document.documentversions
      ?.slice()
      .sort((a, b) => Number(b.version) - Number(a.version));

    this.document = {
      id: queryResult.properties.document.id,
      filename: queryResult.properties.document.filename,
      informationconfidentialityname:
        queryResult.properties.informationconfidentialityname,
      documentcategoryname: queryResult.properties.documentcategoryname,
      languagename: queryResult.properties.languagename,
      sourceofinformationname: queryResult.properties.sourceofinformationname,
      ihrcommunicationname: queryResult.properties.ihrcommunicationname,
      diseasecondition: queryResult.properties.document.diseasecondmetadatas
        ?.map((d) => d.diseasecond.name)
        .join(', '),
      aetiology: queryResult.properties.document.aetiologymetadatas
        ?.map((a) => a.aetiology.name)
        .join(', '),
      syndrome: queryResult.properties.document.syndromemetadatas
        ?.map((s) => s.syndrome.name)
        .join(', '),
      hazard: queryResult.properties.document.hazardmetadatas
        ?.map((h) => h.hazard.name)
        .join(', '),
      country: queryResult.properties.document.countrymetadatas
        ?.map((c) => c.country.name)
        .join(', '),
      region: queryResult.properties.document.regionmetadatas
        ?.map((r) => r.region.name)
        .join(', '),
      createddate: queryResult.properties.document.createddate,
      createdbyuser: [
        queryResult.properties.document.createdbyuser?.firstname,
        queryResult.properties.document.createdbyuser?.lastname,
      ].join(' '),
      createdbyuseremail:
        queryResult.properties.document.createdbyuser?.emailaddress,
      modifieddate: queryResult.properties.document.modifieddate,
      modifiedbyuser: [
        queryResult.properties.document.modifiedbyuser?.firstname,
        queryResult.properties.document.modifiedbyuser?.lastname,
      ].join(' '),
      modifiedbyuseremail:
        queryResult.properties.document.modifiedbyuser?.emailaddress,
      size: versions?.[0]?.size,
      version: versions?.[0]?.version,
      documenttypename: queryResult.properties.documenttypename,
      occurrence: queryResult.properties.document.occurrence?.occurrencename,
      occurrencetype: queryResult.occurrencetypes?.find(
        (o) =>
          o.id === queryResult.properties.document.occurrence?.occurrencetype
      )?.name,
      driveid: queryResult.properties.document.occurrence?.driveid,
      documentrolename: queryResult.properties.documentrolename,
      imsfunctionname:
        queryResult.properties.document.assignmentfunctionmetadatas
          ?.map((f) => f.assignmentfunction.name)
          .join(', '),
    };
  }
}
