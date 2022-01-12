import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebWorkflowComponent } from './web-workflow.component';

describe('WebWorkflowComponent', () => {
  let component: WebWorkflowComponent;
  let fixture: ComponentFixture<WebWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebWorkflowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
