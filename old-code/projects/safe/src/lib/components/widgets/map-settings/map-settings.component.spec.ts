import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';

import { SafeMapSettingsComponent } from './map-settings.component';

describe('SafeMapSettingsComponent', () => {
  let component: SafeMapSettingsComponent;
  let fixture: ComponentFixture<SafeMapSettingsComponent>;
  let controller: ApolloTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, TranslateService],
      declarations: [SafeMapSettingsComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMapSettingsComponent);
    component = fixture.componentInstance;
    component.tile = {
      id: '',
      settings: {},
    };
    fixture.detectChanges();

    const op = controller.expectOne('GetQueryTypes');

    op.flush({
      data: {
        __schema: {
          types: [],
          queryType: {
            fields: [],
          },
        },
      },
    });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
