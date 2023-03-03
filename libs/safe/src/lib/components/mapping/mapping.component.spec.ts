import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeMappingComponent } from './mapping.component';

describe('SafeMappingComponent', () => {
  let component: SafeMappingComponent;
  let fixture: ComponentFixture<SafeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
