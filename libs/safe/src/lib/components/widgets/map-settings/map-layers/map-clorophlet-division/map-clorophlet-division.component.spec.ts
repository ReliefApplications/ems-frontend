import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapClorophletDivisionComponent } from './map-clorophlet-division.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFilterModule } from '../../../../filter/filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('MapClorophletDivisionComponent', () => {
  let component: MapClorophletDivisionComponent;
  let fixture: ComponentFixture<MapClorophletDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
      ],
      declarations: [MapClorophletDivisionComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot(),
        SafeFilterModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClorophletDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
