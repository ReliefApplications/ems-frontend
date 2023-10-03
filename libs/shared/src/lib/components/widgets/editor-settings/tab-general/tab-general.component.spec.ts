import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGeneralEditorSettingsGeneralComponent } from './tab-general.component';

describe('TabGeneralEditorSettingsGeneralComponent', () => {
  let component: TabGeneralEditorSettingsGeneralComponent;
  let fixture: ComponentFixture<TabGeneralEditorSettingsGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabGeneralEditorSettingsGeneralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabGeneralEditorSettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
