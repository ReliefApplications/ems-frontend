import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeEditorControlComponent } from './editor-control.component';

describe('SafeEditorControlComponent', () => {
  let component: SafeEditorControlComponent;
  let fixture: ComponentFixture<SafeEditorControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeEditorControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeEditorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
