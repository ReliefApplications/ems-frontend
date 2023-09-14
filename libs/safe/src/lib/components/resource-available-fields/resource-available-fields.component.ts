import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import { QuestionResourceAvailableFieldsModel } from './resource-available-fields.model';
import { Dialog } from '@angular/cdk/dialog';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {
  GET_SHORT_RESOURCE_BY_ID,
  GetResourceByIdQueryResponse,
} from './graphql/queries';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'safe-resource-available-fields',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class SafeResourceAvailableFieldsComponent
  extends QuestionAngular<QuestionResourceAvailableFieldsModel>
  implements OnInit, OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private el: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private dialog: Dialog,
    private formBuilder: UntypedFormBuilder,
    private apollo: Apollo
  ) {
    super(changeDetectorRef, viewContainerRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    const getResourceById = (data: { id: string }) =>
      this.apollo.query<GetResourceByIdQueryResponse>({
        query: GET_SHORT_RESOURCE_BY_ID,
        variables: {
          id: data.id,
        },
      });
    const btn = document.createElement('button');
    btn.innerText = 'Available grid fields';
    btn.style.width = '100%';
    btn.style.border = 'none';
    btn.style.padding = '10px';
    this.el.nativeElement.appendChild(btn);
    btn.onclick = () => {
      getResourceById({ id: this.model.obj.resource }).subscribe(
        async ({ data }) => {
          if (data.resource && data.resource.name) {
            const nameTrimmed = data.resource.name
              .replace(/\s/g, '')
              .toLowerCase();
            const { ConfigDisplayGridFieldsModalComponent } = await import(
              '../../components/config-display-grid-fields-modal/config-display-grid-fields-modal.component'
            );
            const dialogRef = this.dialog.open(
              ConfigDisplayGridFieldsModalComponent,
              {
                data: {
                  form: !this.model.obj.gridFieldsSettings
                    ? null
                    : this.convertFromRawToFormGroup(
                        this.model.obj.gridFieldsSettings
                      ),
                  resourceName: nameTrimmed,
                },
              }
            );
            dialogRef.closed
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: any) => {
                if (res && res.value.fields) {
                  this.model.obj.gridFieldsSettings = res.getRawValue();
                }
              });
          }
        }
      );
    };
  }

  convertFromRawToFormGroup(gridSettingsRaw: any): UntypedFormGroup | null {
    if (!gridSettingsRaw.fields) {
      return null;
    }
    const auxForm = this.formBuilder.group(gridSettingsRaw);
    auxForm.controls.fields.setValue(gridSettingsRaw.fields);
    return auxForm;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
