import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortGroupComponent } from './sort-group.component';

describe('SortGroupComponent', () => {
  let component: SortGroupComponent;
  let fixture: ComponentFixture<SortGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
