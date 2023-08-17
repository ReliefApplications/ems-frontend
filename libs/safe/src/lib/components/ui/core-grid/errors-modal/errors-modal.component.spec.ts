import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeErrorsModalComponent } from './errors-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';

describe('SafeExpandedCommentComponent', () => {
  let component: SafeErrorsModalComponent;
  let fixture: ComponentFixture<SafeErrorsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      imports: [
        DialogModule,
        TranslateModule.forRoot(),
        SafeErrorsModalComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeErrorsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
