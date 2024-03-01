import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { createAutomationComponentForm } from '../../../../../forms/automation.forms';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { MapLayersService } from '../../../../../services/map/map-layers.service';
import { get } from 'lodash';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

/**
 * Edition of automation component.
 */
@Component({
  selector: 'shared-edit-automation-component',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormWrapperModule,
    SelectMenuModule,
    MonacoEditorModule,
  ],
  templateUrl: './edit-automation-component.component.html',
  styleUrls: ['./edit-automation-component.component.scss'],
})
export class EditAutomationComponentComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Automation component form */
  public formGroup!: ReturnType<typeof createAutomationComponentForm>;
  /** Available widgets */
  public widgets = new BehaviorSubject<any[]>([]);
  /** Current editor */
  public editor: any;
  /** Available editors */
  public editors = [
    {
      component: 'trigger',
      type: 'map.click',
    },
    {
      component: 'action',
      type: 'map.get.country',
    },
    {
      component: 'action',
      type: 'add.layer',
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.widgets.pipe(
            takeUntil(this.destroy$),
            map((widgets) => {
              return widgets
                .filter((widget) => widget.component === 'map')
                .map((x) => ({
                  value: x.id,
                  text: x.name || `Widget #${x.id}`,
                }));
            })
          ),
          onValueChanged: (value: any) => {
            const widget = this.widgets
              .getValue()
              .find((widget) => widget.id === value);
            if (widget) {
              this.mapLayersService
                .getLayers(get(widget, 'settings.layers') || [])
                .pipe(takeUntil(this.destroy$))
                .subscribe((layers) => {
                  this.editor.properties.find(
                    (x: any) => x.name === 'layers'
                  ).choices = layers.map((layer) => ({
                    value: layer.id,
                    text: layer.name,
                  }));
                });
            } else {
              this.editor.properties.find(
                (x: any) => x.name === 'layers'
              ).choices = [];
            }
          },
          onInit: (value: any) => {
            const widget = this.widgets
              .getValue()
              .find((widget) => widget.id === value);
            if (widget) {
              this.mapLayersService
                .getLayers(get(widget, 'settings.layers') || [])
                .pipe(takeUntil(this.destroy$))
                .subscribe((layers) => {
                  this.editor.properties.find(
                    (x: any) => x.name === 'layers'
                  ).choices = layers.map((layer) => ({
                    value: layer.id,
                    text: layer.name,
                  }));
                });
            } else {
              this.editor.properties.find(
                (x: any) => x.name === 'layers'
              ).choices = [];
            }
          },
        },
        {
          name: 'layers',
          required: true,
          editor: 'select',
          multiselect: true,
          async: false,
          choices: [],
        },
      ],
    },
    {
      component: 'action',
      type: 'remove.layer',
      properties: [
        {
          name: 'widget',
          required: true,
          editor: 'select',
          multiselect: false,
          async: true,
          choices: this.widgets.pipe(
            takeUntil(this.destroy$),
            map((widgets) => {
              return widgets
                .filter((widget) => widget.component === 'map')
                .map((x) => ({
                  value: x.id,
                  text: x.name || `Widget #${x.id}`,
                }));
            })
          ),
          onValueChanged: (value: any) => {
            const widget = this.widgets
              .getValue()
              .find((widget) => widget.id === value);
            if (widget) {
              this.mapLayersService
                .getLayers(get(widget, 'settings.layers') || [])
                .pipe(takeUntil(this.destroy$))
                .subscribe((layers) => {
                  this.editor.properties.find(
                    (x: any) => x.name === 'layers'
                  ).choices = layers.map((layer) => ({
                    value: layer.id,
                    text: layer.name,
                  }));
                });
            } else {
              this.editor.properties.find(
                (x: any) => x.name === 'layers'
              ).choices = [];
            }
          },
          onInit: (value: any) => {
            const widget = this.widgets
              .getValue()
              .find((widget) => widget.id === value);
            if (widget) {
              this.mapLayersService
                .getLayers(get(widget, 'settings.layers') || [])
                .pipe(takeUntil(this.destroy$))
                .subscribe((layers) => {
                  this.editor.properties.find(
                    (x: any) => x.name === 'layers'
                  ).choices = layers.map((layer) => ({
                    value: layer.id,
                    text: layer.name,
                  }));
                });
            } else {
              this.editor.properties.find(
                (x: any) => x.name === 'layers'
              ).choices = [];
            }
          },
        },
        {
          name: 'layers',
          required: true,
          editor: 'select',
          multiselect: true,
          async: false,
          choices: [],
        },
      ],
    },
    {
      component: 'action',
      type: 'set.context',
      properties: [
        {
          name: 'mapping',
          type: 'json',
          editor: 'json',
          options: {
            theme: 'vs-dark',
            language: 'json',
            fixedOverflowWidgets: true,
            formatOnPaste: true,
            automaticLayout: true,
          },
        },
      ],
    },
  ];

  /**
   * Edition of automation component.
   *
   * @param dashboardService Dashboard service
   * @param mapLayersService Map layers service
   * @param data Dialog data, automation component to edit
   */
  constructor(
    private dashboardService: DashboardService,
    private mapLayersService: MapLayersService,
    @Inject(DIALOG_DATA) public data: any
  ) {
    super();
    this.formGroup = createAutomationComponentForm(data);
  }

  ngOnInit(): void {
    this.dashboardService.widgets$
      .pipe(takeUntil(this.destroy$))
      .subscribe((widgets: any[]) => {
        this.widgets.next(widgets || []);
      });
    this.editor = this.editors.find(
      (editor) =>
        editor.component === this.data.component &&
        editor.type === this.data.type
    );
    for (const key in this.editor.properties) {
      const property = this.editor.properties[key];
      if (property.onValueChanged) {
        (this.formGroup as any)
          .get(`value.${property.name}`)
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => property.onValueChanged(value));
      }
      if (property.onInit) {
        property.onInit(
          (this.formGroup as any).get(`value.${property.name}`).value
        );
      }
    }
  }
}
