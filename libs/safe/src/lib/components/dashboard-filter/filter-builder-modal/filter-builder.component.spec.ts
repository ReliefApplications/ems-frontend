import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeFilterBuilderComponent } from './filter-builder.component';

describe('FilterBuilderComponent', () => {
  let component: SafeFilterBuilderComponent;
  let fixture: ComponentFixture<SafeFilterBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeFilterBuilderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SafeFilterBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
