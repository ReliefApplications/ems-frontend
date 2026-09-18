import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Change } from '../../../models/records-history.model';
import { RecordHistoryCardsComponent } from './record-history-cards.component';

describe('RecordHistoryCardsComponent', () => {
  let component: RecordHistoryCardsComponent;
  let fixture: ComponentFixture<RecordHistoryCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecordHistoryCardsComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordHistoryCardsComponent);
    component = fixture.componentInstance;
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
});
