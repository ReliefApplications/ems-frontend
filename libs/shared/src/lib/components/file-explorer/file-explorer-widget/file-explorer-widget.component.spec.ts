import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerWidgetComponent } from './file-explorer-widget.component';

describe('FileExplorerWidgetComponent', () => {
  let component: FileExplorerWidgetComponent;
  let fixture: ComponentFixture<FileExplorerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
