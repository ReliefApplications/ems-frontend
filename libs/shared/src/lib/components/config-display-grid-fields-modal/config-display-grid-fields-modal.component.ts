import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { UntypedFormGroup } from '@angular/forms';
import { createQueryForm } from '../query-builder/query-builder-forms';
import { CommonModule } from '@angular/common';
import { SpinnerModule } from '@oort-front/ui';
import { QueryBuilderModule } from '../query-builder/query-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';

/**
 * Interface that describes the structure of the data shown in the dialog
 */
interface DialogData {
  form: any;
  resourceName: string;
}

/**
 * This component is used in the grids to display a modal to configurate the fields in the grid
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    QueryBuilderModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'shared-config-display-grid-fields-modal',
  templateUrl: './config-display-grid-fields-modal.component.html',
  styleUrls: ['./config-display-grid-fields-modal.component.css'],
})
export class ConfigDisplayGridFieldsModalComponent implements OnInit {
  public form: UntypedFormGroup = new UntypedFormGroup({});
  public loading = true;

  @ViewChild('settingsContainer', { read: ViewContainerRef })
  settingsContainer: any;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param data The data to be shown in the modal
   * @param queryBuilder The service used to build queries
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private queryBuilder: QueryBuilderService
  ) {}

  ngOnInit(): void {
    this.queryBuilder.availableQueries$.subscribe((res) => {
      if (res.length > 0) {
        const hasDataForm = this.data.form !== null;
        const queryName = hasDataForm
          ? this.data.form.value.name
          : this.queryBuilder.getQueryNameFromResourceName(
              this.data.resourceName
            );
        this.form = createQueryForm({
          name: queryName,
          fields: hasDataForm ? this.data.form.value.fields : [],
          sort: hasDataForm ? this.data.form.value.sort : {},
          filter: hasDataForm ? this.data.form.value.filter : {},
        });
        this.loading = false;
      }
    });
  }
}
