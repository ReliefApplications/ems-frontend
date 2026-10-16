import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DraftSaveStatusComponent } from './draft-save-status.component';

describe('DraftSaveStatusComponent', () => {
  let fixture: ComponentFixture<DraftSaveStatusComponent>;
  let component: DraftSaveStatusComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftSaveStatusComponent, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(DraftSaveStatusComponent);
    component = fixture.componentInstance;
  });

  const text = (): string =>
    (fixture.nativeElement as HTMLElement).textContent?.trim() ?? '';

  it('shows nothing before any draft save', () => {
    fixture.detectChanges();

    expect(text()).toBe('');
  });

  it('shows a grey saving text while a draft is being saved, even after a previous save', () => {
    component.saving = true;
    component.savedAt = new Date();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(text()).toContain('components.form.draftRecords.saving');
    expect(text()).not.toContain(
      'components.form.draftRecords.autoSaveSuccess'
    );
    expect(element.querySelector('.text-gray-500')).not.toBeNull();
    // Spinner on the left of the text
    expect(element.querySelector('ui-spinner')).not.toBeNull();
  });

  it('shows the latest save time once saved', () => {
    component.savedAt = new Date('2026-10-16T10:00:00Z');
    fixture.detectChanges();

    expect(text()).toContain('components.form.draftRecords.autoSaveSuccess');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.text-green-700')
    ).not.toBeNull();
  });
});
