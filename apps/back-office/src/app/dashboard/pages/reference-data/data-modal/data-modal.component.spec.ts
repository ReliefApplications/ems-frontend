import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataModalComponent } from './data-modal.component';

describe('DataModalComponent', () => {
  let component: DataModalComponent;
  let fixture: ComponentFixture<DataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
