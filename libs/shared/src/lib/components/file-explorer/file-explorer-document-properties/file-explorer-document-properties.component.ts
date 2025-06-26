import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetDocumentByIdResponse } from '../../../services/document-management/graphql/queries';

/**
 * Component to display the properties of a document in the file explorer.
 * It takes the document properties as input and formats them for display.
 */
@Component({
  selector: 'shared-file-explorer-document-properties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-explorer-document-properties.component.html',
  styleUrls: ['./file-explorer-document-properties.component.scss'],
})
export class FileExplorerDocumentPropertiesComponent implements OnChanges {
  /** Raw document properties */
  @Input() properties!: GetDocumentByIdResponse['properties'];
  /** Document properties, formatted for display */
  public document!: {
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
    modifieddate?: string;
    modifiedbyuser?: string;
    size?: number;
    version?: string;
    documenttypename?: string;
    occurrence?: string;
    documentrolename?: string;
    imsfunctionname?: string;
  };

  ngOnChanges(): void {
    const versions = this.properties.document.documentversions
      ?.slice()
      .sort((a, b) => Number(b.version) - Number(a.version));
    this.document = {
      filename: this.properties.document.filename,
      informationconfidentialityname:
        this.properties.informationconfidentialityname,
      documentcategoryname: this.properties.documentcategoryname,
      languagename: this.properties.languagename,
      sourceofinformationname: this.properties.sourceofinformationname,
      ihrcommunicationname: this.properties.ihrcommunicationname,
      diseasecondition: this.properties.document.diseasecondmetadatas
        ?.map((d) => d.diseasecond.name)
        .join(', '),
      aetiology: this.properties.document.aetiologymetadatas
        ?.map((a) => a.aetiology.name)
        .join(', '),
      syndrome: this.properties.document.syndromemetadatas
        ?.map((s) => s.syndrome.name)
        .join(', '),
      hazard: this.properties.document.hazardmetadatas
        ?.map((h) => h.hazard.name)
        .join(', '),
      country: this.properties.document.countrymetadatas
        ?.map((c) => c.country.name)
        .join(', '),
      region: this.properties.document.regionmetadatas
        ?.map((r) => r.region.name)
        .join(', '),
      createddate: this.properties.document.createddate,
      createdbyuser: [
        this.properties.document.createdbyuser?.firstname,
        this.properties.document.createdbyuser?.lastname,
      ].join(' '),
      modifieddate: this.properties.document.modifieddate,
      modifiedbyuser: [
        this.properties.document.modifiedbyuser?.firstname,
        this.properties.document.modifiedbyuser?.lastname,
      ].join(' '),
      size: versions?.[0]?.size,
      version: versions?.[0]?.version,
      documenttypename: this.properties.documenttypename,
      occurrence: this.properties.document.occurrence?.occurrencename,
      documentrolename: this.properties.documentrolename,
      imsfunctionname: this.properties.document.assignmentfunctionmetadatas
        ?.map((f) => f.assignmentfunction.name)
        .join(', '),
    };
  }
}
