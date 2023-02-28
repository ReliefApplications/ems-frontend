import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPullJobModalComponent } from './edit-pull-job-modal.component';

describe('EditPullJobModalComponent', () => {
  let component: EditPullJobModalComponent;
  let fixture: ComponentFixture<EditPullJobModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPullJobModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPullJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
