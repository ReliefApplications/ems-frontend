import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog, DialogRef , DIALOG_DATA } from '@angular/cdk/dialog';
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
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            updateSize: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            addPanelClass: () => {},
          },
        },
        { provide: DIALOG_DATA, useValue: { title: '', content: '' } },
      ],
      declarations: [SafeStatusModalComponent],
      imports: [DialogModule],
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
