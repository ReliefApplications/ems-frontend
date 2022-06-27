import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
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

import { SafeMapComponent } from './map.component';

describe('SafeMapComponent', () => {
  let component: SafeMapComponent;
  let fixture: ComponentFixture<SafeMapComponent>;
  let controller: ApolloTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder, TranslateService],
      declarations: [SafeMapComponent],
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
    fixture = TestBed.createComponent(SafeMapComponent);
    component = fixture.componentInstance;
    component.settings = {
      centerLong: 0,
      centerLat: 0,
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
