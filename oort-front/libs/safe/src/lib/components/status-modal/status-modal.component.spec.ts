import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { SafeStatusModalComponent } from './status-modal.component';

describe('StatusModalComponent', () => {
  let component: SafeStatusModalComponent;
  let fixture: ComponentFixture<SafeStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            updateSize: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            addPanelClass: () => {},
          },
        },
        { provide: MAT_DIALOG_DATA, useValue: { title: '', content: '' } },
      ],
      declarations: [SafeStatusModalComponent],
      imports: [MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
