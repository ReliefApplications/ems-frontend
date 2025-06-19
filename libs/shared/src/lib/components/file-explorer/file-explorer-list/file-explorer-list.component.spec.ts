import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerListComponent } from './file-explorer-list.component';

describe('FileExplorerListComponent', () => {
  let component: FileExplorerListComponent;
  let fixture: ComponentFixture<FileExplorerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
