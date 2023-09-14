import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeExpandedCommentComponent } from './expanded-comment.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule, TextareaModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SafeExpandedCommentComponent', () => {
  let component: SafeExpandedCommentComponent;
  let fixture: ComponentFixture<SafeExpandedCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: { updateSize: jest.fn() } },
        { provide: DIALOG_DATA, useValue: {} },
      ],
      declarations: [SafeExpandedCommentComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot(),
        TextareaModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeExpandedCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
