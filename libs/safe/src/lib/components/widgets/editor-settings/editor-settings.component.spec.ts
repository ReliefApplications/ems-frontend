import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { SafeEditorSettingsComponent } from './editor-settings.component';

describe('SafeEditorSettingsComponent', () => {
  let component: SafeEditorSettingsComponent;
  let fixture: ComponentFixture<SafeEditorSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, TranslateService],
      declarations: [SafeEditorSettingsComponent],
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
    fixture = TestBed.createComponent(SafeEditorSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {
      id: '',
      settings: {
        title: '',
        text: '',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
