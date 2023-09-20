import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextualFiltersSettingsComponent } from './contextual-filters-settings.component';

describe('ContextualFiltersSettingsComponent', () => {
  let component: ContextualFiltersSettingsComponent;
  let fixture: ComponentFixture<ContextualFiltersSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextualFiltersSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextualFiltersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
