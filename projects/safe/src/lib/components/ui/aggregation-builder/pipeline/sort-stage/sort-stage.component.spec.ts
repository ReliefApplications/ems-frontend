import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeSortStageComponent } from './sort-stage.component';

describe('SafeSortStageComponent', () => {
  let component: SafeSortStageComponent;
  let fixture: ComponentFixture<SafeSortStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSortStageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSortStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
