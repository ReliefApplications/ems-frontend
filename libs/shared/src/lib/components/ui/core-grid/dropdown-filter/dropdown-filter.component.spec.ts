import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterService } from '@progress/kendo-angular-grid';

import { DropdownFilterComponent } from './dropdown-filter.component';

describe('DropdownFilterComponent', () => {
  let component: DropdownFilterComponent;
  let fixture: ComponentFixture<sharedDropdownFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FilterService],
      declarations: [DropdownFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
