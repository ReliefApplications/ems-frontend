import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapClorophletComponent } from './map-clorophlet.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ButtonModule,
  DialogModule,
  SelectMenuModule,
  SliderModule,
  TableModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('MapClorophletComponent', () => {
  let component: MapClorophletComponent;
  let fixture: ComponentFixture<MapClorophletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: { addPanelClass: jest.fn() } },
      ],
      declarations: [MapClorophletComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot(),
        ButtonModule,
        SelectMenuModule,
        FormsModule,
        ReactiveFormsModule,
        SliderModule,
        TableModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClorophletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
