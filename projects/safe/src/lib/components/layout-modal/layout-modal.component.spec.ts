import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeLayoutModalComponent } from './layout-modal.component';

describe('SafeLayoutModalComponent', () => {
  let component: SafeLayoutModalComponent;
  let fixture: ComponentFixture<SafeLayoutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeLayoutModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeLayoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
