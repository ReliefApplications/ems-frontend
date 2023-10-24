import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingSettingsComponent } from './sorting-settings.component';

describe('SortingSettingsComponent', () => {
  let component: SortingSettingsComponent;
  let fixture: ComponentFixture<SortingSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortingSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
