import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSettingsModalComponent } from './filter-settings-modal.component';

describe('FilterSettingsModalComponent', () => {
  let component: FilterSettingsModalComponent;
  let fixture: ComponentFixture<FilterSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSettingsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
