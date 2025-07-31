import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerToolbarComponent } from './file-explorer-toolbar.component';

describe('FileExplorerToolbarComponent', () => {
  let component: FileExplorerToolbarComponent;
  let fixture: ComponentFixture<FileExplorerToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
