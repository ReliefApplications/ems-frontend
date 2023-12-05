import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
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
export class AddLayerModalComponent {
  public layerControl = new FormControl<string | null>(null);
  public layersQuery = this.apollo.watchQuery<LayersQueryResponse>({
    query: GET_LAYERS,
  });

  /**
   * Modal to select existing layer to add to map widget.
   *
   * @param apollo Angular apollo
   */
  constructor(private apollo: Apollo) {}
}
