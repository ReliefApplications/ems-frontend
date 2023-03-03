import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeDividerComponent } from './divider.component';

describe('SafeDividerComponent', () => {
  let component: SafeDividerComponent;
  let fixture: ComponentFixture<SafeDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeDividerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
