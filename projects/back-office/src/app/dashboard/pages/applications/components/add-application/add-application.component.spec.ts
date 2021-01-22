import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationComponent } from './add-application.component';

describe('AddApplicationComponent', () => {
  let component: AddApplicationComponent;
  let fixture: ComponentFixture<AddApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
