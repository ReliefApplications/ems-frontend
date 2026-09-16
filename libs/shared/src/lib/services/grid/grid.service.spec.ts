import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { GridService } from './grid.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('GridService', () => {
  let service: GridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: {} },
        TranslateService,
        { provide: Apollo, useValue: {} },
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFields / readOnlyFields', () => {
    /** Minimal scalar field definition, as saved in a grid widget query. */
    const fields = [{ name: 'email', label: 'Email', type: 'Text' }];

    it('should disable a field listed in readOnlyFields, even if the user can update it', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: true } },
      };

      const result = service.getFields(fields, metaFields, {}, '', {
        disabled: false,
        hidden: false,
        filter: true,
        readOnlyFields: ['email'],
      });

      expect(result[0].disabled).toBe(true);
    });

    it('should keep a field editable when it is not listed in readOnlyFields and the user can update it', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: true } },
      };

      const result = service.getFields(fields, metaFields, {}, '', {
        disabled: false,
        hidden: false,
        filter: true,
        readOnlyFields: [],
      });

      expect(result[0].disabled).toBe(false);
    });

    it('should still disable a field the user cannot update, regardless of readOnlyFields', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: false } },
      };

      const result = service.getFields(fields, metaFields, {}, '', {
        disabled: false,
        hidden: false,
        filter: true,
        readOnlyFields: [],
      });

      expect(result[0].disabled).toBe(true);
    });

    it('should default to no read-only fields when the option is omitted', () => {
      const metaFields = {
        email: { permissions: { canSee: true, canUpdate: true } },
      };

      // called without the 5th ( options ) argument, as done before this feature existed
      const result = service.getFields(fields, metaFields, {}, '');

      expect(result[0].disabled).toBe(false);
    });
  });
});
