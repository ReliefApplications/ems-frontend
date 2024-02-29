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
  ],
  templateUrl: './edit-automation-component.component.html',
  styleUrls: ['./edit-automation-component.component.scss'],
})
export class EditAutomationComponentComponent
  extends UnsubscribeComponent
  implements OnInit
{
  public formGroup!: ReturnType<typeof createAutomationComponentForm>;
  public widgets = new BehaviorSubject<any[]>([]);

  public editor: any;

  public editors = [
    {
      component: 'action',
      type: 'add.layer',
      properties: [
        {
          name: 'widget',
          type: 'widget',
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
                  console.log(this.editor);
                });
            } else {
              this.editor.properties.layer.choices = [];
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
                  console.log(this.editor);
                });
            } else {
              this.editor.properties.layer.choices = [];
            }
          },
        },
        {
          name: 'layers',
          type: 'layer',
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
          type: 'widget',
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
                  console.log(this.editor);
                });
            } else {
              this.editor.properties.layer.choices = [];
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
                  console.log(this.editor);
                });
            } else {
              this.editor.properties.layer.choices = [];
            }
          },
        },
        {
          name: 'layers',
          type: 'layer',
          required: true,
          editor: 'select',
          multiselect: true,
          async: false,
          choices: [],
        },
      ],
    },
  ];

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
          .subscribe((value: any) => property.onValueChanged(value).bind(this));
      }
      if (property.onInit) {
        property.onInit(
          (this.formGroup as any).get(`value.${property.name}`).value
        );
      }
    }
  }
}
