import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeExpandedCommentComponent } from './expanded-comment.component';

describe('SafeExpandedCommentComponent', () => {
  let component: SafeExpandedCommentComponent;
  let fixture: ComponentFixture<SafeExpandedCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeExpandedCommentComponent ]
    })
    .compileComponents();
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
