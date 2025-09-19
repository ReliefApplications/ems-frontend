import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerFoldersFilterComponent } from './file-explorer-folders-filter.component';

describe('FileExplorerFoldersFilterComponent', () => {
  let component: FileExplorerFoldersFilterComponent;
  let fixture: ComponentFixture<FileExplorerFoldersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerFoldersFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerFoldersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
