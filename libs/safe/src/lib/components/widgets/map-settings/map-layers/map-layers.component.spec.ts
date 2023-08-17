import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapLayersComponent } from './map-layers.component';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from '@oort-front/ui';
import { MapMarkersModule } from './map-markers/map-markers.module';
import { MapClorophletsModule } from './map-clorophlets/map-clorophlets.module';
import { MapOnlineLayersModule } from './map-online-layers/map-online-layers.module';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MapLayersComponent', () => {
  let component: MapLayersComponent;
  let fixture: ComponentFixture<MapLayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [MapLayersComponent],
      imports: [
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
        TabsModule,
        MapMarkersModule,
        MapClorophletsModule,
        MapOnlineLayersModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLayersComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      latitude: new UntypedFormControl(),
      longitude: new UntypedFormControl(),
      category: new UntypedFormControl(),
      popupFields: new UntypedFormControl(),
      clorophlets: new UntypedFormArray([]),
      onlineLayers: new UntypedFormControl({}),
      markerRules: new UntypedFormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
