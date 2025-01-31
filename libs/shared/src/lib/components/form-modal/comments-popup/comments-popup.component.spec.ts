import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsPopupComponent } from './comments-popup.component';

describe('CommentsPopupComponent', () => {
  let component: CommentsPopupComponent;
  let fixture: ComponentFixture<CommentsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
