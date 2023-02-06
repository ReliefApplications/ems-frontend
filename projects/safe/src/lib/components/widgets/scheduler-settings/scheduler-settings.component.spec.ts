import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { SafeSchedulerSettingsComponent } from './scheduler-settings.component';

describe('SafeSchedulerSettingsComponent', () => {
  let component: SafeSchedulerSettingsComponent;
  let fixture: ComponentFixture<SafeSchedulerSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, TranslateService],
      declarations: [SafeSchedulerSettingsComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSchedulerSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {
      if: '',
      settings: {
        source: '',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
