import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortRowComponent } from './sort-row.component';

describe('SortRowComponent', () => {
  let component: SortRowComponent;
  let fixture: ComponentFixture<SortRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SortRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SortRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
