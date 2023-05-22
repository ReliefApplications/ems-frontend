import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog, DialogRef , DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeExpandedCommentComponent } from './expanded-comment.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

describe('SafeExpandedCommentComponent', () => {
  let component: SafeExpandedCommentComponent;
  let fixture: ComponentFixture<SafeExpandedCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        TranslateService,
      ],
      declarations: [SafeExpandedCommentComponent],
      imports: [
        DialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
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
