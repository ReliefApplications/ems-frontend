import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowWidgetComponent } from './workflow-widget.component';

describe('WorkflowWidgetComponent', () => {
  let component: WorkflowWidgetComponent;
  let fixture: ComponentFixture<WorkflowWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
