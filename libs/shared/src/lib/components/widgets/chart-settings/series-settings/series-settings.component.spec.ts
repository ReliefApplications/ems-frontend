import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesSettingsComponent } from './series-settings.component';

describe('SeriesSettingsComponent', () => {
  let component: SeriesSettingsComponent;
  let fixture: ComponentFixture<SeriesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
