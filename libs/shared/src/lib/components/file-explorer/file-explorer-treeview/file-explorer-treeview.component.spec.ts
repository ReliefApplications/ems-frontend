import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerTreeviewComponent } from './file-explorer-treeview.component';

describe('FileExplorerTreeviewComponent', () => {
  let component: FileExplorerTreeviewComponent;
  let fixture: ComponentFixture<FileExplorerTreeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerTreeviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerTreeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
