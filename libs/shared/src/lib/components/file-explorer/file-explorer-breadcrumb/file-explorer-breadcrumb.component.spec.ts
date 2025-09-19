import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerBreadcrumbComponent } from './file-explorer-breadcrumb.component';

describe('FileExplorerBreadcrumbComponent', () => {
  let component: FileExplorerBreadcrumbComponent;
  let fixture: ComponentFixture<FileExplorerBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerBreadcrumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileExplorerBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
