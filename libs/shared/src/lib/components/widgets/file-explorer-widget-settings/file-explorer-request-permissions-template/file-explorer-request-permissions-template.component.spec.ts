import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerRequestPermissionsTemplateComponent } from './file-explorer-request-permissions-template.component';

describe('FileExplorerRequestPermissionsTemplateComponent', () => {
  let component: FileExplorerRequestPermissionsTemplateComponent;
  let fixture: ComponentFixture<FileExplorerRequestPermissionsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerRequestPermissionsTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FileExplorerRequestPermissionsTemplateComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
