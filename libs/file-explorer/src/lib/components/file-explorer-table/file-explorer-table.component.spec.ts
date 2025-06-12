import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerTableComponent } from './file-explorer-table.component';

describe('FileExplorerTableComponent', () => {
  let component: FileExplorerTableComponent;
  let fixture: ComponentFixture<FileExplorerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
