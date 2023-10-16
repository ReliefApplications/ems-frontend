import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSettingsModalComponent } from './view-settings.component';

describe('ViewSettingsModalComponent', () => {
  let component: ViewSettingsModalComponent;
  let fixture: ComponentFixture<ViewSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSettingsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
