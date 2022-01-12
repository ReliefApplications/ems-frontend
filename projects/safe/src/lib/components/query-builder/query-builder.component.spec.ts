import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeQueryBuilderComponent } from './query-builder.component';

describe('SafeQueryBuilderComponent', () => {
  let component: SafeQueryBuilderComponent;
  let fixture: ComponentFixture<SafeQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeQueryBuilderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
