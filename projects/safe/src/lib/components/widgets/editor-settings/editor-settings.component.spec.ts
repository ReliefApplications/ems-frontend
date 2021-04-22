import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEditorSettingsComponent } from './editor-settings.component';

describe('SafeEditorSettingsComponent', () => {
  let component: SafeEditorSettingsComponent;
  let fixture: ComponentFixture<SafeEditorSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SafeEditorSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEditorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
