import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResourceSelectComponent } from '../../../controls/public-api';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../../models/resource.model';
import { Apollo } from 'apollo-angular';
import { GET_RESOURCE } from './graphql/queries';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/**
 * Component for displaying a tab with form settings in the file explorer widget settings.
 * Allows users to configure form-related settings.
 */
@Component({
  selector: 'shared-file-explorer-form-tab',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ResourceSelectComponent,
    ReactiveFormsModule,
    FormWrapperModule,
    SelectMenuModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './file-explorer-form-tab.component.html',
  styleUrls: ['./file-explorer-form-tab.component.scss'],
})
export class FileExplorerFormTabComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Selected resource, if any */
  public resource: Resource | null = null;
  /** Apollo service */
  private apollo = inject(Apollo);

  ngOnInit(): void {
    // Subscribe to form group changes
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((id: string) => {
        if (id) {
          this.getResource(id);
        } else {
          this.resource = null; // Reset resource if no id is provided
        }
      });
    // Initialize query
    if (this.formGroup.value.resource) {
      this.getResource(this.formGroup.value.resource);
    }
  }

  /**
   * Fetch resource by id and its forms.
   *
   * @param id Resource id
   */
  private getResource(id: string) {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: { id },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        if (data.resource) {
          this.resource = data.resource;
        } else {
          this.resource = null;
        }
      });
  }
}
