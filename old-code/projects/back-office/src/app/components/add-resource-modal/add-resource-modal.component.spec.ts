import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceModalComponent } from './add-resource.component';

describe('AddResourceModalComponent', () => {
  let component: AddResourceModalComponent;
  let fixture: ComponentFixture<AddResourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddResourceModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
