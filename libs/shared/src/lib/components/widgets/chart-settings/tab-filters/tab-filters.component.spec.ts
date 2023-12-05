import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFiltersComponent } from './tab-filters.component';

describe('TabFiltersComponent', () => {
  let component: TabFiltersComponent;
  let fixture: ComponentFixture<TabFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
