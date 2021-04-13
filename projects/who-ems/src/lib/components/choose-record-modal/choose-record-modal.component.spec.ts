import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRecordModalComponent } from './choose-record-modal.component';

describe('ChooseRecordModalComponent', () => {
  let component: ChooseRecordModalComponent;
  let fixture: ComponentFixture<ChooseRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseRecordModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
