import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { SafeGraphQLSelectModule } from '../../../graphql-select/graphql-select.module';
import { SafeMapLayersService } from '../../../../services/map/map-layers.service';
import { Apollo } from 'apollo-angular';
import {
  GetLayersQueryResponse,
  GET_LAYERS,
} from '../../../../services/map/graphql/queries';

@Component({
  selector: 'safe-add-layer-modal',
  standalone: true,
  imports: [
    CommonModule,
    SafeModalModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    SafeGraphQLSelectModule,
  ],
  templateUrl: './add-layer-modal.component.html',
  styleUrls: ['./add-layer-modal.component.scss'],
})
export class AddLayerModalComponent {
  public layerControl = new FormControl<string | null>(null);
  public layersQuery = this.apollo.watchQuery<GetLayersQueryResponse>({
    query: GET_LAYERS,
  });

  constructor(
    private apollo: Apollo,
    private mapLayersService: SafeMapLayersService
  ) {}
}
