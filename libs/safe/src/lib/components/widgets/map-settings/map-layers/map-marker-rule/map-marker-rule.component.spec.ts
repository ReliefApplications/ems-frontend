import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapMarkerRuleComponent } from './map-marker-rule.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFilterModule } from '../../../../filter/filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('MapMarkerRuleComponent', () => {
  let component: MapMarkerRuleComponent;
  let fixture: ComponentFixture<MapMarkerRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
      ],
      declarations: [MapMarkerRuleComponent],
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
    fixture = TestBed.createComponent(MapMarkerRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
