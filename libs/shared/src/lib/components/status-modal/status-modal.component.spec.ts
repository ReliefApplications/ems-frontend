import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { StatusModalComponent } from './status-modal.component';

describe('StatusModalComponent', () => {
  let component: StatusModalComponent;
  let fixture: ComponentFixture<StatusModalComponent>;

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
      declarations: [StatusModalComponent],
      imports: [DialogCdkModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
