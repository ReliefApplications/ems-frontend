import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import {
  PopupElement,
  PopupElementType,
} from '../../../../../models/layer.model';
import { createPopupElementForm } from '../../map-forms';
import { Fields } from '../../../../../models/layer.model';
import { Observable, takeUntil } from 'rxjs';
import { INLINE_EDITOR_CONFIG } from '../../../../../const/tinymce.const';
import { EditorService } from '../../../../../services/editor/editor.service';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { DomPortal } from '@angular/cdk/portal';
import { ApplicationService } from '../../../../../services/application/application.service';
import { Application } from '../../../../../models/application.model';
import { ContentType, Page } from '../../../../../models/page.model';

/**
 * Map layer popup settings component.
 */
@Component({
  selector: 'shared-layer-popup',
  templateUrl: './layer-popup.component.html',
  styleUrls: ['./layer-popup.component.scss'],
})
export class LayerPopupComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Current form group */
  @Input() formGroup!: FormGroup;
  /** Map dom portal */
  @Input() mapPortal?: DomPortal;
  /** Available fields */
  @Input() fields$!: Observable<Fields[]>;
  /** Keys for editor */
  public keys: { text: string; value: string }[] = [];
  /** Available fields */
  public fields: any[] = [];
  /** Editor configuration */
  public editorConfig = INLINE_EDITOR_CONFIG;
  /** Available pages from the application */
  public pages: ReturnType<typeof this.getPages> = [];
  /** Grid actions */
  public navigateOptions = {
    name: 'navigateToPage',
    text: 'components.widget.settings.grid.actions.navigateToPage',
    tooltip: 'components.widget.settings.grid.hint.actions.navigateToPage',
  };
  /** Show select page id and checkbox for record id */
  public showSelectPage = false;

  /** @returns popup elements as form array */
  get popupElements(): FormArray {
    return this.formGroup.get('popupElements') as FormArray;
  }

  /**
   * Creates an instance of LayerPopupComponent.
   *
   * @param editorService Shared tinymce editor service
   * @param applicationService Shared application service
   */
  constructor(
    private editorService: EditorService,
    public applicationService: ApplicationService
  ) {
    super();
  }

  ngOnInit(): void {
    // Listen to fields changes
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.fields = value;
      const keys = value.map((field) => ({
        text: `{{${field.name}}}`,
        value: `{{${field.name}}}`,
      }));
      this.editorService.addCalcAndKeysAutoCompleter(this.editorConfig, keys);
    });

    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    this.pages = this.getPages(application);

    this.showSelectPage = this.formGroup.get('navigateToPage')?.value;
    this.formGroup
      .get('navigateToPage')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((val: boolean) => {
        this.showSelectPage = val;
      });
  }

  /**
   * Handles the event emitted when a layer is reordered
   *
   * @param event Event emitted when a layer is reordered
   */
  public onListDrop(event: CdkDragDrop<PopupElement[]>) {
    moveItemInArray(
      this.popupElements.controls,
      event.previousIndex,
      event.currentIndex
    );
  }

  /**
   * Add a new content block text or field block)
   *
   * @param type content type (text or field)
   */
  public onAddElement(type: PopupElementType): void {
    this.popupElements.push(createPopupElementForm({ type }));
  }

  /**
   * Remove content item from the array
   *
   * @param {number} index item index
   */
  public onRemoveElement(index: number): void {
    this.popupElements.removeAt(index);
  }

  /**
   * Get available pages from app
   *
   * @param application application
   * @returns list of pages and their url
   */
  private getPages(application: Application | null) {
    return (
      application?.pages?.map((page: any) => ({
        id: page.id,
        name: page.name,
        urlParams: this.getPageUrlParams(application, page),
        placeholder: `{{page(${page.id})}}`,
      })) || []
    );
  }

  /**
   * Get page url params
   *
   * @param application application
   * @param page page to get url from
   * @returns url of the page
   */
  private getPageUrlParams(application: Application, page: Page): string {
    return page.type === ContentType.form
      ? `${application.id}/${page.type}/${page.id}`
      : `${application.id}/${page.type}/${page.content}`;
  }
}
