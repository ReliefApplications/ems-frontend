import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';

/**
 * Sets default config with fake translate module for the given component
 *
 * @param {Type} component Component to declare for the testing module used in spec file
 */
export const setupSpecConfig = async (component: Type<any>) => {
  await TestBed.configureTestingModule({
    providers: [TranslateService],
    declarations: [component],
    imports: [
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader,
        },
      }),
    ],
  }).compileComponents();
};
