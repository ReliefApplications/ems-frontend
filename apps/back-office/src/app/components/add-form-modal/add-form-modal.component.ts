import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GET_RESOURCE_BY_ID } from './graphql/queries';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ToggleModule,
  TooltipModule,
  RadioModule,
  IconModule,
  ButtonModule,
  SelectMenuModule,
  ChipModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
import { DialogRef } from '@angular/cdk/dialog';
import {
  Form,
  ResourceQueryResponse,
  ResourceSelectComponent,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs';

/**
 * Add form component (modal)
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    ToggleModule,
    TranslateModule,
    DialogModule,
    TooltipModule,
    RadioModule,
    IconModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    ChipModule,
    ResourceSelectComponent,
  ],
  selector: 'app-add-form-modal',
  templateUrl: './add-form-modal.component.html',
  styleUrls: ['./add-form-modal.component.scss'],
})
export class AddFormModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Form group */
  public form = this.fb.group({
    name: ['', Validators.required],
    newResource: this.fb.nonNullable.control(true),
    resource: [null],
    inheritsTemplate: this.fb.nonNullable.control(false),
    template: null,
  });
  /** Available templates */
  public templates: Form[] = [];

  /**
   * Selected template
   *
   * @returns {Form} selected template
   */
  get selectedTemplate() {
    return this.templates.find(
      (x) => x.id === this.form.get('template')?.value
    );
  }

  /**
   * Add form modal
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param apollo Apollo service
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<AddFormModalComponent>,
    private apollo: Apollo
  ) {
    super();
  }

  /** Load the resources and build the form. */
  ngOnInit(): void {
    this.form
      .get('newResource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('resource')?.clearValidators();
          this.form.patchValue({
            resource: null,
            inheritsTemplate: false,
            template: null,
          });
        } else {
          this.form.get('resource')?.setValidators([Validators.required]);
        }
        this.form.get('resource')?.updateValueAndValidity();
      });

    this.form
      .get('inheritsTemplate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (value) {
          this.form.get('template')?.setValidators([Validators.required]);
        } else {
          this.form.get('template')?.clearValidators();
          this.form.patchValue({
            template: null,
          });
        }
        this.form.get('template')?.updateValueAndValidity();
      });

    this.form
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string | null) => {
        if (value) {
          this.getResource(value);
        } else {
          this.templates = [];
        }
        this.form.patchValue({
          template: null,
        });
      });
  }

  /**
   * Called on resource input change.
   * Load the templates linked to that resource.
   *
   * @param id resource id
   */
  getResource(id: string): void {
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id,
        },
      })
      .subscribe({
        next: ({ data }) => {
          this.templates = data.resource.forms || [];
        },
      });
  }
}
