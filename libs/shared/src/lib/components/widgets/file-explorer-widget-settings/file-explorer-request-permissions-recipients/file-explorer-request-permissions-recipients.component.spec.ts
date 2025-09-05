import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileExplorerRequestPermissionsRecipientsComponent } from './file-explorer-request-permissions-recipients.component';

describe('FileExplorerRequestPermissionsRecipientsComponent', () => {
  let component: FileExplorerRequestPermissionsRecipientsComponent;
  let fixture: ComponentFixture<FileExplorerRequestPermissionsRecipientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileExplorerRequestPermissionsRecipientsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FileExplorerRequestPermissionsRecipientsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
