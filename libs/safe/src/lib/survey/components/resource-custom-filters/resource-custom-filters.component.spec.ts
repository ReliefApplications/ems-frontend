import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResorceCustomFiltersComponent } from './resorce-custom-filters.component';

describe('ResorceCustomFiltersComponent', () => {
  let component: ResorceCustomFiltersComponent;
  let fixture: ComponentFixture<ResorceCustomFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResorceCustomFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResorceCustomFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
