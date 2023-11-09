import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSettingsComponent } from './section-settings.component';

describe('SectionSettingsComponent', () => {
  let component: SectionSettingsComponent;
  let fixture: ComponentFixture<SectionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
