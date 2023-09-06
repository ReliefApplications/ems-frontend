import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSettingsComponent } from './tab-settings.component';

describe('TabSettingsComponent', () => {
  let component: TabSettingsComponent;
  let fixture: ComponentFixture<TabSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
