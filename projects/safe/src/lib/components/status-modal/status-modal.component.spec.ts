import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
            updateSize: (width: any, height: any) => {},
            addPanelClass: (str: any) => {},
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
