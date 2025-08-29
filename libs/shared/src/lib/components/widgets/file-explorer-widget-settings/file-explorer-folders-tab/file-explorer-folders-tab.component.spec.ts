import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerFoldersTabComponent } from './file-explorer-folders-tab.component';

describe('FileExplorerFoldersTabComponent', () => {
  let component: FileExplorerFoldersTabComponent;
  let fixture: ComponentFixture<FileExplorerFoldersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerFoldersTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerFoldersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
