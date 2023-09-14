import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeResourceSelectTextComponent } from './resource-select-text.component';

describe('SafeResourceSelectTextComponent', () => {
  let component: SafeResourceSelectTextComponent;
  let fixture: ComponentFixture<SafeResourceSelectTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeResourceSelectTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeResourceSelectTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
