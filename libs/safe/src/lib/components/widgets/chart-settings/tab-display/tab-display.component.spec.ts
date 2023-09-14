import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabDisplayComponent } from './tab-display.component';
import { TranslateModule } from '@ngx-translate/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import {
  ExpansionPanelModule,
  IconModule,
  SelectMenuModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SafePaletteControlModule } from '../../../palette-control/palette-control.module';
import { SeriesSettingsModule } from '../series-settings/series-settings.module';
import { SafeChartModule } from '../../chart/chart.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TabDisplayComponent', () => {
  let component: TabDisplayComponent;
  let fixture: ComponentFixture<TabDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabDisplayComponent],
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        CdkAccordionModule,
        ExpansionPanelModule,
        SelectMenuModule,
        InputsModule,
        ToggleModule,
        IconModule,
        SafePaletteControlModule,
        SeriesSettingsModule,
        SafeChartModule,
        ApolloTestingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabDisplayComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({
      chart: new UntypedFormGroup({
        legend: new UntypedFormGroup({ position: new UntypedFormControl() }),
        title: new UntypedFormGroup({
          text: new UntypedFormControl(),
          size: new UntypedFormControl(),
          position: new UntypedFormControl(),
          color: new UntypedFormControl(),
        }),
        palette: new UntypedFormGroup({
          enabled: new UntypedFormControl(),
          value: new UntypedFormControl(),
        }),
        labels: new UntypedFormGroup({ showValue: new UntypedFormControl() }),
        series: new UntypedFormArray([]),
      }),
    });
    component.type = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
