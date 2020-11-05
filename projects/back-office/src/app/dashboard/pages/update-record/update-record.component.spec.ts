import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRecordComponent } from './update-record.component';

describe('UpdateRecordComponent', () => {
  let component: UpdateRecordComponent;
  let fixture: ComponentFixture<UpdateRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
