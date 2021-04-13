import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFormComponent } from './form.component';

describe('SafeFormComponent', () => {
  let component: SafeFormComponent;
  let fixture: ComponentFixture<SafeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
