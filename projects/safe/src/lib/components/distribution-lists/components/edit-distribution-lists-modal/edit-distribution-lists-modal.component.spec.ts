import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributionListsModalComponent } from './edit-distribution-lists-modal.component';

describe('EditDistributionListsModalComponent', () => {
  let component: EditDistributionListsModalComponent;
  let fixture: ComponentFixture<EditDistributionListsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDistributionListsModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDistributionListsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
