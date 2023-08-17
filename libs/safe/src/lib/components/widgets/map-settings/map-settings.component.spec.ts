import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { SafeMapSettingsComponent } from './map-settings.component';
import { IconModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { MapLayersModule } from './map-layers/map-layers.module';
import { MapPropertiesModule } from './map-properties/map-properties.module';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';
import { MapGeneralModule } from './map-general/map-general.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SafeMapSettingsComponent', () => {
  let component: SafeMapSettingsComponent;
  let fixture: ComponentFixture<SafeMapSettingsComponent>;
  let controller: ApolloTestingController;
  jest.mock('leaflet');

  beforeEach(waitForAsync(() => {
    //TODOTEST
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        TranslateService,
        { provide: 'environment', useValue: {} },
      ],
      declarations: [SafeMapSettingsComponent],
      imports: [
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
        TabsModule,
        IconModule,
        TooltipModule,
        MapGeneralModule,
        MapLayersModule,
        MapPropertiesModule,
        FormsModule,
        ReactiveFormsModule,
        DisplaySettingsComponent,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMapSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {
      id: '',
      settings: {},
    };
    fixture.detectChanges();

    const op1 = controller.expectOne('GetQueryTypes');

    op1.flush({
      data: {
        __schema: {
          types: [],
          queryType: {
            fields: [],
          },
        },
      },
    });

    const op2 = controller.expectOne('GetResources');

    op2.flush({ data: { resources: [] } });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
