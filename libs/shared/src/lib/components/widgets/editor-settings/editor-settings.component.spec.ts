import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { EditorSettingsComponent } from './editor-settings.component';

describe('EditorSettingsComponent', () => {
  let component: EditorSettingsComponent;
  let fixture: ComponentFixture<EditorSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, TranslateService],
      declarations: [EditorSettingsComponent],
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
    fixture = TestBed.createComponent(EditorSettingsComponent);
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
