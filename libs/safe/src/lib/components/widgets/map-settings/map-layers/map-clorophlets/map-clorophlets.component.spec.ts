import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapClorophletsComponent } from './map-clorophlets.component';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  TableModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { UntypedFormArray } from '@angular/forms';

describe('MapClorophletsComponent', () => {
  let component: MapClorophletsComponent;
  let fixture: ComponentFixture<MapClorophletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapClorophletsComponent],
      imports: [
        DialogModule,
        AlertModule,
        TranslateModule.forRoot(),
        ButtonModule,
        TableModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClorophletsComponent);
    component = fixture.componentInstance;
    component.clorophlets = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
