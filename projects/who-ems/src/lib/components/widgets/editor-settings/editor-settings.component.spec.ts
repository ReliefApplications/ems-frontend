import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoEditorSettingsComponent } from './editor-settings.component';

describe('WhoEditorSettingsComponent', () => {
  let component: WhoEditorSettingsComponent;
  let fixture: ComponentFixture<WhoEditorSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoEditorSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoEditorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
