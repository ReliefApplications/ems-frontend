import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerListItemComponent } from './file-explorer-list-item.component';

describe('FileExplorerListItemComponent', () => {
  let component: FileExplorerListItemComponent;
  let fixture: ComponentFixture<FileExplorerListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
