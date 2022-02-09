import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafePipelineComponent } from './pipeline.component';

describe('SafePipelineComponent', () => {
  let component: SafePipelineComponent;
  let fixture: ComponentFixture<SafePipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafePipelineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
