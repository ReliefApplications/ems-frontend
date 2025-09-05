import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerDocumentPropertiesComponent } from './file-explorer-document-properties.component';

describe('FileExplorerDocumentPropertiesComponent', () => {
  let component: FileExplorerDocumentPropertiesComponent;
  let fixture: ComponentFixture<FileExplorerDocumentPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerDocumentPropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerDocumentPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
