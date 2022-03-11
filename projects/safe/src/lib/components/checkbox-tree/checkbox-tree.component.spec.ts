import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeCheckboxTreeComponent } from './checkbox-tree.component';

describe('SafeCheckboxTreeComponent', () => {
  let component: SafeCheckboxTreeComponent;
  let fixture: ComponentFixture<SafeCheckboxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeCheckboxTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeCheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
