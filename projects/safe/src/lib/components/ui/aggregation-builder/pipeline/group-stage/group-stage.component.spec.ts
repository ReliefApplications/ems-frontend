import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeGroupStageComponent } from './group-stage.component';

describe('SafeGroupStageComponent', () => {
  let component: SafeGroupStageComponent;
  let fixture: ComponentFixture<SafeGroupStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGroupStageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGroupStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
