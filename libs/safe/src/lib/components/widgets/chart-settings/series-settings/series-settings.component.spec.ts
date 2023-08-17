import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeSeriesSettingsComponent } from './series-settings.component';
import { UntypedFormArray } from '@angular/forms';

describe('SeriesSettingsComponent', () => {
  let component: SafeSeriesSettingsComponent;
  let fixture: ComponentFixture<SafeSeriesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSeriesSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeSeriesSettingsComponent);
    component = fixture.componentInstance;
    component.formArray = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
