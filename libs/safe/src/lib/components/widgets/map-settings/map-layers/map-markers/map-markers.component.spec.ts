import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapMarkersComponent } from './map-markers.component';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  IconModule,
  SelectMenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

describe('MapMarkersComponent', () => {
  let component: MapMarkersComponent;
  let fixture: ComponentFixture<MapMarkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapMarkersComponent],
      imports: [
        DialogModule,
        AlertModule,
        TranslateModule.forRoot(),
        SelectMenuModule,
        IconModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        TableModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMarkersComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({
      latitude: new UntypedFormControl(),
      longitude: new UntypedFormControl(),
      category: new UntypedFormControl(),
      popupFields: new UntypedFormControl(),
      markerRules: new UntypedFormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
