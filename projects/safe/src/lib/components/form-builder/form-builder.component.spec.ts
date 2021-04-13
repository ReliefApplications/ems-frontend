import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFormBuilderComponent } from './form-builder.component';

describe('SafeFormBuilderComponent', () => {
  let component: SafeFormBuilderComponent;
  let fixture: ComponentFixture<SafeFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeFormBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
