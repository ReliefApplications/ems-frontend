import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_LAYERS } from './graphql/queries';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  GraphQLSelectModule,
} from '@oort-front/ui';
import { LayersQueryResponse } from '../../../../models/layer.model';

/**
 * Modal to select existing layer to add to map widget.
 */
@Component({
  selector: 'shared-add-layer-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    GraphQLSelectModule,
    ButtonModule,
  ],
  templateUrl: './add-layer-modal.component.html',
  styleUrls: ['./add-layer-modal.component.scss'],
})
export class AddLayerModalComponent implements OnInit {
  /**
   * Control to select the layer to add
   */
  public layerControl = new FormControl<string | null>(null);
  /**
   * Query to get layers
   */
  public layersQuery!: QueryRef<LayersQueryResponse>;

  /**
   * Modal to select existing layer to add to map widget.
   *
   * @param apollo Angular apollo
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.layersQuery = this.apollo.watchQuery<LayersQueryResponse>({
      query: GET_LAYERS,
      variables: {
        sortField: 'name',
      },
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onSearchChange(search: string): void {
    const variables = this.layersQuery.variables;
    this.layersQuery.refetch({
      ...variables,
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: search,
          },
        ],
      },
    });
  }
}
