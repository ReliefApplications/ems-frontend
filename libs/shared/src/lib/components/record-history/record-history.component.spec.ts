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
