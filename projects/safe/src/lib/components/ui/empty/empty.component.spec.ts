import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEmptyComponent } from './empty.component';

describe('SafeEmptyComponent', () => {
  let component: SafeEmptyComponent;
  let fixture: ComponentFixture<SafeEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeEmptyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
