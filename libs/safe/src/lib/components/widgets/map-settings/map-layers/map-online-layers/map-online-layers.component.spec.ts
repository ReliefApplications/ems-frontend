import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapOnlineLayersComponent } from './map-online-layers.component';
import { AlertModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';

describe('MapOnlineLayersComponent', () => {
  let component: MapOnlineLayersComponent;
  let fixture: ComponentFixture<MapOnlineLayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [MapOnlineLayersComponent],
      imports: [
        AlertModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOnlineLayersComponent);
    component = fixture.componentInstance;
    component.layers = new UntypedFormControl({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
