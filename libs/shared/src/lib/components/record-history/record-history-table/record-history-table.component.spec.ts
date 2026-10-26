import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Change } from '../../../models/records-history.model';
import { RecordHistoryTableComponent } from './record-history-table.component';

describe('RecordHistoryTableComponent', () => {
  let component: RecordHistoryTableComponent;
  let fixture: ComponentFixture<RecordHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecordHistoryTableComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('flattens history entries into one row per change', () => {
    component.history = [
      {
        createdAt: new Date(),
        createdBy: 'tester',
        changes: [
          { type: 'add', field: 'a', displayName: 'A', new: '"1"' },
          { type: 'modify', field: 'b', displayName: 'B', old: '1', new: '2' },
        ],
      },
    ];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.rows.map((row) => row.displayName)).toEqual(['A', 'B']);
    expect(fixture.nativeElement.querySelectorAll('tr[cdk-row]').length).toBe(
      2
    );
  });

  it('only renders the displayed columns', () => {
    component.displayedColumns = ['date', 'action'];
    component.history = [
      {
        createdAt: new Date(),
        createdBy: 'tester',
        changes: [{ type: 'add', field: 'a', displayName: 'A', new: '"1"' }],
      },
    ];

    component.ngOnChanges();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('th').length).toBe(2);
  });

  describe('setHistoryForTableFromChange', () => {
    it('pushes a renderError row instead of throwing on malformed change data', () => {
      component.rows = [];
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
      expect(component.rows[0].renderError).toBe(true);
    });

    it('stores plain text and highlighted html for table values', () => {
      component.rows = [];
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

      expect(component.rows[0].oldHtml).toContain(
        '2026-7-7 : Палата Палата Палата'
      );
      expect(component.rows[0].newHtml).toContain(
        '2026-7-7 : Палата Палата Палата'
      );
      expect(component.rows[0].oldHtml).not.toContain('<div>');
      expect(component.rows[0].newHtml).not.toContain('<div>');
      expect(component.rows[0].newHtml).toContain(
        '<mark class="history-value-highlight history-value-highlight-added"> Палата</mark>'
      );
    });

    it('stores plain text for escaped html table values', () => {
      component.rows = [];
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

      expect(component.rows[0].newHtml).toBe(
        'Patient notes: Lorem ipsum dolor sit amet.'
      );
      expect(component.rows[0].newHtml).not.toContain('&lt;p&gt;');
      expect(component.rows[0].newHtml).not.toContain('&lt;strong&gt;');
    });

    it('marks long table values as expandable', () => {
      component.rows = [];
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

      expect(component.rows[0].expandable).toBe(true);
      expect(component.rows[0].expanded).toBeUndefined();
    });

    it('toggles expanded state for a table comparison', () => {
      component.rows = [];
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

      const row = component.rows[0];
      component.toggleHistoryValue(row);
      expect(row.expanded).toBe(true);

      component.toggleHistoryValue(row);
      expect(row.expanded).toBe(false);
    });
  });
});
