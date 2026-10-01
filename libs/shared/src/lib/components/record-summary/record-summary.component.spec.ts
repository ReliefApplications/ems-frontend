import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { RecordSummaryComponent } from './record-summary.component';
import { RecordSummaryModule } from './record-summary.module';

describe('RecordSummaryComponent', () => {
  let component: RecordSummaryComponent;
  let fixture: ComponentFixture<RecordSummaryComponent>;

  /**
   * Finds the rendered history button.
   *
   * @returns The history button element, if displayed
   */
  const historyButton = () =>
    fixture.nativeElement.querySelector('ui-button[icon="history"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecordSummaryModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the history button of a record by default', () => {
    component.record = { id: 'record-id', createdAt: new Date() };
    fixture.detectChanges();

    expect(historyButton()).not.toBeNull();
  });

  it('should hide the history button when asked to', () => {
    component.record = { id: 'draft-id', createdAt: new Date(), draft: true };
    component.canShowHistory = false;
    fixture.detectChanges();

    expect(historyButton()).toBeNull();
  });
});
