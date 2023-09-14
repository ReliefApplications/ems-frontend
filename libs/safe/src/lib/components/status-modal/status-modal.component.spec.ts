import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeStatusModalComponent } from './status-modal.component';

describe('StatusModalComponent', () => {
  let component: SafeStatusModalComponent;
  let fixture: ComponentFixture<SafeStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
            addPanelClass: jest.fn(),
            removePanelClass: jest.fn(),
          },
        },
        { provide: DIALOG_DATA, useValue: { title: '', content: '' } },
      ],
      imports: [DialogCdkModule, SafeStatusModalComponent],
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
