import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSortingSettingsComponent } from './sorting-settings.component';

describe('SafeSortingSettingsComponent', () => {
  let component: SafeSortingSettingsComponent;
  let fixture: ComponentFixture<SafeSortingSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSortingSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeSortingSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
