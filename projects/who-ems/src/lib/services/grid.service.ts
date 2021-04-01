import { Injectable } from '@angular/core';
import { WhoChartSettingsComponent } from '../components/widgets/chart-settings/chart-settings.component';
import { WhoSchedulerSettingsComponent } from '../components/widgets/scheduler-settings/scheduler-settings.component';
import { WhoGridSettingsComponent } from '../components/widgets/grid-settings/grid-settings.component';
import { WhoMapSettingsComponent } from '../components/widgets/map-settings/map-settings.component';
import { WhoEditorSettingsComponent } from '../components/widgets/editor-settings/editor-settings.component';

@Injectable({
  providedIn: 'root',
})
/*  Grid service for the dashboards.
  Expose the available tiles, and find the settings from a widget.
*/
export class WhoGridService {

  // === LIST OF DEFAULT WIDGETS AVAILABLE ===
  public availableTiles = [
    {
      name: 'BAR CHART',
      icon: 'bar_chart',
      settings: {
        title: 'Bar chart',
        chart: {
          type: 'bar'
        }
      },
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'DONUT CHART',
      icon: 'donut_small',
      settings: {title: 'Donut chart', chart: {
        type: 'donut'
      }},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'LINE CHART',
      icon: 'show_chart',
      settings: {title: 'Line chart', chart: {
        type: 'line'
      }},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'PIE CHART',
      icon: 'pie_chart',
      settings: {title: 'Pie chart', chart: {
        type: 'pie'
      }},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    // {
    //   name: 'SCATTER PLOT',
    //   icon: 'scatter_plot',
    //   settings: {title: 'Scatter chart', chart: {
    //     type: 'scatter'
    //   }},
    //   defaultCols: 2,
    //   defaultRows: 2,
    //   component: 'chart',
    //   settingsTemplate: WhoChartSettingsComponent
    // },
    // {
    //   name: 'SCHEDULER',
    //   icon: 'schedule',
    //   settings: {title: 'Scheduler'},
    //   defaultCols: 3,
    //   defaultRows: 3,
    //   component: 'scheduler',
    //   settingsTemplate: WhoSchedulerSettingsComponent
    // },
    {
      name: 'GRID',
      icon: 'view_column',
      settings: {
        title: 'New grid',
        sortable: false,
        from: 'resource',
        pageable: false,
        source: null,
        fields: [],
        toolbar: false,
        canAdd: false
      },
      defaultCols: 4,
      defaultRows: 4,
      component: 'grid',
      settingsTemplate: WhoGridSettingsComponent
    },
    {
      name: 'MAP',
      icon: 'explore',
      settings: {},
      defaultCols: 3,
      defaultRows: 3,
      component: 'map',
      settingsTemplate: WhoMapSettingsComponent
    },
    {
      name: 'TEXT',
      icon: 'text_fields',
      settings: {title: 'Enter a title', text: 'Enter a content'},
      defaultCols: 3,
      defaultRows: 3,
      component: 'editor',
      settingsTemplate: WhoEditorSettingsComponent
    }
  ];

  constructor() { }

  /*  Find the settings component from the widget passed as 'tile'.
  */
  public findSettingsTemplate(tile: any): any {
    const availableTile = this.availableTiles.find(x => x.component === tile.component);
    return availableTile && availableTile.settingsTemplate ? availableTile.settingsTemplate : null;
  }
}
