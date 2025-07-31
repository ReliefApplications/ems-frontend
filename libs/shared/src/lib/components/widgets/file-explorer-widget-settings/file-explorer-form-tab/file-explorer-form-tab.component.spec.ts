import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerFormTabComponent } from './file-explorer-form-tab.component';

describe('FileExplorerFormTabComponent', () => {
  let component: FileExplorerFormTabComponent;
  let fixture: ComponentFixture<FileExplorerFormTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerFormTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
