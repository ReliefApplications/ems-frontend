import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsSettingsComponent } from './tabs-settings.component';

describe('TabsSettingsComponent', () => {
  let component: TabsSettingsComponent;
  let fixture: ComponentFixture<TabsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
