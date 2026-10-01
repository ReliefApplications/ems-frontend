import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  StatusOptions,
  StatusOptionsComponent,
} from './status-options.component';

describe('StatusOptionsComponent', () => {
  let fixture: ComponentFixture<StatusOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StatusOptionsComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusOptionsComponent);
  });

  it('renders draft instead of the stored lifecycle status', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.componentRef.setInput('isDraft', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Common.status_draft');
    expect(fixture.nativeElement.textContent).not.toContain(
      'Common.status_active'
    );
  });

  it.each<StatusOptions>(['active', 'pending', 'archived'])(
    'renders the %s lifecycle status for non-drafts',
    (status) => {
      fixture.componentRef.setInput('status', status);
      fixture.componentRef.setInput('isDraft', false);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain(
        `Common.status_${status}`
      );
    }
  );
});
