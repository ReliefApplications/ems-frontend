import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeChartSettingsComponent } from './chart-settings.component';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SafeChartSettingsComponent', () => {
  let component: SafeChartSettingsComponent;
  let fixture: ComponentFixture<SafeChartSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: {} },
        TranslateService,
      ],
      declarations: [SafeChartSettingsComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        TabsModule,
        TranslateModule.forRoot(),
        IconModule,
        TooltipModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeChartSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {
      settings: {
        title: '',
        chart: {
          type: 'line',
        },
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
