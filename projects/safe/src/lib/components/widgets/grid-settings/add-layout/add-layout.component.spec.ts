import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLayoutComponent } from './add-layout.component';

describe('AddLayoutComponent', () => {
  let component: AddLayoutComponent;
  let fixture: ComponentFixture<AddLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
