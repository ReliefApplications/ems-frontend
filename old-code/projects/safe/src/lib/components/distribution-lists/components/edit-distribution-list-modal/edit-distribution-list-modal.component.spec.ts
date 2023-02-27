import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDistributionListModalComponent } from './edit-distribution-list-modal.component';

describe('EditDistributionListModalComponent', () => {
  let component: EditDistributionListModalComponent;
  let fixture: ComponentFixture<EditDistributionListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDistributionListModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDistributionListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
