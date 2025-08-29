import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerDocumentToolbarComponent } from './file-explorer-document-toolbar.component';

describe('FileExplorerDocumentToolbarComponent', () => {
  let component: FileExplorerDocumentToolbarComponent;
  let fixture: ComponentFixture<FileExplorerDocumentToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerDocumentToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerDocumentToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
