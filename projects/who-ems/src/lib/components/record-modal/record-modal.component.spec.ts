import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoRecordModalComponent } from './record-modal.component';

describe('WhoRecordModalComponent', () => {
  let component: WhoRecordModalComponent;
  let fixture: ComponentFixture<WhoRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoRecordModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
