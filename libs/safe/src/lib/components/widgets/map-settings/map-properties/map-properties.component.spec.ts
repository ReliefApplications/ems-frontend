import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapPropertiesComponent } from './map-properties.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ErrorMessageModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  SliderModule,
  TooltipModule,
} from '@oort-front/ui';
import { SafeMapModule } from '../../map/map.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
jest.mock('leaflet', () => {
  const originalModule = jest.requireActual('leaflet');
  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    esri: {},
  };
});

describe('MapPropertiesComponent', () => {
  let component: MapPropertiesComponent;
  let fixture: ComponentFixture<MapPropertiesComponent>;
  //TODOTEST

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [MapPropertiesComponent],
      imports: [
        TranslateModule.forRoot(),
        SelectMenuModule,
        IconModule,
        SliderModule,
        SafeMapModule,
        ApolloTestingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        ErrorMessageModule,
        FormWrapperModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPropertiesComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      basemap: new UntypedFormControl(),
      zoom: new UntypedFormControl(),
      centerLat: new UntypedFormControl(),
      centerLong: new UntypedFormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
