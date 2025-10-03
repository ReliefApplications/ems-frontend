import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerWidgetSettingsComponent } from './file-explorer-widget-settings.component';

describe('FileExplorerWidgetSettingsComponent', () => {
  let component: FileExplorerWidgetSettingsComponent;
  let fixture: ComponentFixture<FileExplorerWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerWidgetSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
