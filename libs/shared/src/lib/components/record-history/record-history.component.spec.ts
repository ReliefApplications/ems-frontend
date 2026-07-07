import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { RecordHistoryComponent } from './record-history.component';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { MenuModule } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

/** Number of history entries fetched per page, mirrors the component's own constant */
const HISTORY_PAGE_SIZE = 20;

describe('RecordHistoryComponent', () => {
  let component: RecordHistoryComponent;
  let fixture: ComponentFixture<RecordHistoryComponent>;
  let apolloQueryMock: jest.Mock;

  beforeEach(async () => {
    apolloQueryMock = jest.fn().mockReturnValue(
      of({
        data: {
          record: { id: '1', form: {}, resource: {} },
          recordHistory: [],
        },
      })
    );

    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
        { provide: 'environment', useValue: {} },
        { provide: Apollo, useValue: { query: apolloQueryMock } },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
      ],
      declarations: [RecordHistoryComponent],
      imports: [
        DialogCdkModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        MenuModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordHistoryComponent);
    component = fixture.componentInstance;
    component.record = {
      data: {},
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getHTMLFromChange', () => {
    it('renders boolean values correctly, not always "true"', () => {
      const change: any = {
        type: 'modify',
        field: 'active',
        displayName: 'Active',
        old: JSON.stringify(false),
        new: JSON.stringify(true),
      };
      const html = component.getHTMLFromChange(change);
      expect(html).toContain('false');
      expect(html).toContain('true');
    });

    it('renders a false "add" value as false, not true', () => {
      const change: any = {
        type: 'add',
        field: 'active',
        displayName: 'Active',
        new: JSON.stringify(false),
      };
      const html = component.getHTMLFromChange(change);
      expect(html).toContain('false');
      expect(html).not.toContain('>true<');
    });

    it('returns a fallback message instead of throwing on malformed change data', () => {
      const change: any = {
        type: 'modify',
        field: 'x',
        displayName: 'X',
        old: '{not valid json',
        new: '"ok"',
      };
      expect(() => component.getHTMLFromChange(change)).not.toThrow();
      const html = component.getHTMLFromChange(change);
      expect(html).toContain('components.history.renderError');
    });
  });

  describe('setHistoryForTableFromChange', () => {
    it('pushes a renderError row instead of throwing on malformed change data', () => {
      component.historyForTable = [];
      const change: any = {
        type: 'modify',
        field: 'x',
        displayName: 'X',
        old: '{bad',
        new: undefined,
      };
      expect(() =>
        component.setHistoryForTableFromChange(change, {
          createdAt: new Date(),
          createdBy: 'tester',
        })
      ).not.toThrow();
      expect(component.historyForTable[0].renderError).toBe(true);
    });
  });

  describe('loadMoreHistory', () => {
    it('appends the next page and keeps hasMoreHistory true on a full page', () => {
      component.history = [];
      component.hasMoreHistory = true;
      const fullPage = Array.from({ length: HISTORY_PAGE_SIZE }, () => ({
        createdAt: new Date(),
        createdBy: 'tester',
        changes: [
          { type: 'modify', field: 'x', displayName: 'X', old: '1', new: '2' },
        ],
      }));
      apolloQueryMock.mockReturnValueOnce(
        of({ data: { recordHistory: fullPage } })
      );

      component.loadMoreHistory();

      expect(component.history.length).toBe(HISTORY_PAGE_SIZE);
      expect(component.hasMoreHistory).toBe(true);
      expect(component.loadingMore).toBe(false);
    });

    it('clears hasMoreHistory once a partial page is returned', () => {
      component.history = [];
      component.hasMoreHistory = true;
      const partialPage = [
        {
          createdAt: new Date(),
          createdBy: 'tester',
          changes: [
            {
              type: 'modify',
              field: 'x',
              displayName: 'X',
              old: '1',
              new: '2',
            },
          ],
        },
      ];
      apolloQueryMock.mockReturnValueOnce(
        of({ data: { recordHistory: partialPage } })
      );

      component.loadMoreHistory();

      expect(component.history.length).toBe(1);
      expect(component.hasMoreHistory).toBe(false);
    });

    it('does nothing when there is no more history to load', () => {
      component.history = [];
      component.hasMoreHistory = false;
      apolloQueryMock.mockClear();

      component.loadMoreHistory();

      expect(apolloQueryMock).not.toHaveBeenCalled();
    });
  });
});
