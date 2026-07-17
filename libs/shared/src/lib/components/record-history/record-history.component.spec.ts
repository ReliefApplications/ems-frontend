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
import { Change } from '../../models/records-history.model';

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
      const change: Change = {
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
      const change: Change = {
        type: 'add',
        field: 'active',
        displayName: 'Active',
        new: JSON.stringify(false),
      };
      const html = component.getHTMLFromChange(change);
      expect(html).toContain('false');
      expect(html).not.toContain('>true<');
    });

    it('strips html markup from values before rendering', () => {
      const change: Change = {
        type: 'add',
        field: 'notes',
        displayName: 'Notes',
        new: JSON.stringify('<p>lorem <strong>ipsum</strong> test</p>'),
      };

      const html = component.getHTMLFromChange(change);

      expect(html).toContain('lorem ipsum test');
      expect(html).not.toContain('<strong>');
      expect(html).not.toContain('&lt;strong&gt;');
    });

    it('strips escaped html markup from values before rendering', () => {
      const change: Change = {
        type: 'add',
        field: 'notes',
        displayName: 'Notes',
        new: JSON.stringify(
          '&lt;p&gt;&lt;strong&gt;Patient notes:&lt;/strong&gt; Lorem ipsum&lt;/p&gt;'
        ),
      };

      const html = component.getHTMLFromChange(change);

      expect(html).toContain('Patient notes: Lorem ipsum');
      expect(html).not.toContain('&lt;p&gt;');
      expect(html).not.toContain('&lt;strong&gt;');
    });

    it('highlights the changed part of modified text values', () => {
      const change: Change = {
        type: 'modify',
        field: 'notes',
        displayName: 'Notes',
        old: JSON.stringify('Patient notes were short'),
        new: JSON.stringify('Patient notes were much longer'),
      };

      const html = component.getHTMLFromChange(change);

      expect(html).toContain(
        '<mark class="history-value-highlight history-value-highlight-removed">short</mark>'
      );
      expect(html).toContain(
        '<mark class="history-value-highlight history-value-highlight-added">much longer</mark>'
      );
    });

    it('highlights removed text separately when modified text gets shorter', () => {
      const change: Change = {
        type: 'modify',
        field: 'notes',
        displayName: 'Notes',
        old: JSON.stringify(
          'Patient notes kept this sentence and removed this longer ending.'
        ),
        new: JSON.stringify('Patient notes kept this sentence'),
      };

      const html = component.getHTMLFromChange(change);

      expect(html).toContain(
        '<mark class="history-value-highlight history-value-highlight-removed"> and removed this longer ending.</mark>'
      );
      expect(html).not.toContain('history-value-highlight-added');
    });

    it('returns a fallback message instead of throwing on malformed change data', () => {
      const change: Change = {
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
      const change: Change = {
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

    it('stores plain text and highlighted html for table values', () => {
      component.historyForTable = [];
      const change: Change = {
        type: 'modify',
        field: 'previouspatientnotes',
        displayName: 'previouspatientnotes',
        old: JSON.stringify('<div>2026-7-7 : Палата Палата Палата</div>'),
        new: JSON.stringify(
          '<div>2026-7-7 : Палата Палата Палата Палата</div>'
        ),
      };

      component.setHistoryForTableFromChange(change, {
        createdAt: new Date(),
        createdBy: 'tester',
      });

      expect(component.historyForTable[0].oldHtml).toContain(
        '2026-7-7 : Палата Палата Палата'
      );
      expect(component.historyForTable[0].newHtml).toContain(
        '2026-7-7 : Палата Палата Палата'
      );
      expect(component.historyForTable[0].oldHtml).not.toContain('<div>');
      expect(component.historyForTable[0].newHtml).not.toContain('<div>');
      expect(component.historyForTable[0].newHtml).toContain(
        '<mark class="history-value-highlight history-value-highlight-added"> Палата</mark>'
      );
    });

    it('stores plain text for escaped html table values', () => {
      component.historyForTable = [];
      const change: Change = {
        type: 'add',
        field: 'htmlMarkup',
        displayName: 'HTML Markup',
        new: JSON.stringify(
          '&lt;p&gt;&lt;strong&gt;Patient notes:&lt;/strong&gt; Lorem ipsum dolor sit amet.&lt;/p&gt;'
        ),
      };

      component.setHistoryForTableFromChange(change, {
        createdAt: new Date(),
        createdBy: 'tester',
      });

      expect(component.historyForTable[0].newHtml).toBe(
        'Patient notes: Lorem ipsum dolor sit amet.'
      );
      expect(component.historyForTable[0].newHtml).not.toContain('&lt;p&gt;');
      expect(component.historyForTable[0].newHtml).not.toContain(
        '&lt;strong&gt;'
      );
    });

    it('marks long table values as expandable', () => {
      component.historyForTable = [];
      const change: Change = {
        type: 'add',
        field: 'notes',
        displayName: 'Notes',
        new: JSON.stringify('Patient notes '.repeat(30)),
      };

      component.setHistoryForTableFromChange(change, {
        createdAt: new Date(),
        createdBy: 'tester',
      });

      expect(component.historyForTable[0].expandable).toBe(true);
      expect(component.historyForTable[0].expanded).toBeUndefined();
    });

    it('toggles expanded state for a table comparison', () => {
      component.historyForTable = [];
      const change: Change = {
        type: 'modify',
        field: 'notes',
        displayName: 'Notes',
        old: JSON.stringify('Old patient notes '.repeat(30)),
        new: JSON.stringify('New patient notes '.repeat(30)),
      };

      component.setHistoryForTableFromChange(change, {
        createdAt: new Date(),
        createdBy: 'tester',
      });

      const row = component.historyForTable[0];
      component.toggleHistoryValue(row);
      expect(row.expanded).toBe(true);

      component.toggleHistoryValue(row);
      expect(row.expanded).toBe(false);
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
