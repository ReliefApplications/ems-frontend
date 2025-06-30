import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterModule } from '../../../filter/filter.module';
import { FormGroup } from '@angular/forms';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { DocumentManagementService } from '../../../../services/document-management/document-management.service';
import { takeUntil } from 'rxjs';
import { get } from 'lodash';
import { SpinnerModule } from '@oort-front/ui';

/** Field interface */
interface Field {
  name: string;
  queryField: string;
  type: string;
  editor: string;
  multiSelect: boolean;
  options: { text: string; value: string | number }[];
}

/**
 * Component for filtering file explorer folders
 * Define the default widget's filtering, that users cannot overwrite.
 */
@Component({
  selector: 'shared-file-explorer-folders-filter',
  standalone: true,
  imports: [CommonModule, FilterModule, SpinnerModule],
  templateUrl: './file-explorer-folders-filter.component.html',
  styleUrls: ['./file-explorer-folders-filter.component.scss'],
})
export class FileExplorerFoldersFilterComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Loading indicator */
  public loading = true;
  /** Filter fields */
  public fields: Field[] = [
    {
      name: 'aetiologyid',
      queryField: 'aetiologys',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'informationconfidentialityid',
      queryField: 'informationconfidentialitys',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'countryid',
      queryField: 'countrys',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'diseasecondid',
      queryField: 'diseaseconds',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'documentcategoryid',
      queryField: 'documentcategorys',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'documenttypeid',
      queryField: 'documenttypes',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'hazardid',
      queryField: 'hazards',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'ihrcommunicationid',
      queryField: 'ihrcommunications',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'assignmentfunctionid',
      queryField: 'assignmentfunctions',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'documentroleid',
      queryField: 'documentroles',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'languageid',
      queryField: 'languages',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },

    {
      name: 'occurrenceid',
      queryField: 'occurrences',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'occurrencetype',
      queryField: 'occurrencetypes',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'regionid',
      queryField: 'regions',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'sourceofinformationid',
      queryField: 'sourceofinformations',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
    {
      name: 'syndromeid',
      queryField: 'syndromes',
      type: 'tagbox',
      editor: 'select',
      multiSelect: true,
      options: [],
    },
  ];
  /** Document management service */
  private documentManagementService = inject(DocumentManagementService);

  ngOnInit(): void {
    this.documentManagementService
      .getFieldsOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.fields.forEach((field) => {
          get(data, field.queryField, []).forEach((item: any) => {
            field.options.push({
              text: item.name,
              value: item.id,
            });
          });
        });
        this.loading = false;
      });
  }
}
