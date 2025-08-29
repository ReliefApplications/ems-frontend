import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerFoldersListBoxComponent } from './file-explorer-folders-list-box.component';

describe('FileExplorerFoldersListBoxComponent', () => {
  let component: FileExplorerFoldersListBoxComponent;
  let fixture: ComponentFixture<FileExplorerFoldersListBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerFoldersListBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerFoldersListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
