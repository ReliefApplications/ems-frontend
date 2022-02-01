import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceRecordsComponent } from './resource-records.component';

describe('ResourceRecordsComponent', () => {
  let component: ResourceRecordsComponent;
  let fixture: ComponentFixture<ResourceRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
