import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortStageComponent } from './sort-stage.component';

describe('SortStageComponent', () => {
  let component: SortStageComponent;
  let fixture: ComponentFixture<SortStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortStageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
