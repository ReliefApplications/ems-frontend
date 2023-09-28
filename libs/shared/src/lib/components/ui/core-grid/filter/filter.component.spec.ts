import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterService } from '@progress/kendo-angular-grid';
import { GridFilterComponent } from './filter.component';

describe('GridFilterComponent', () => {
  let component: GridFilterComponent;
  let fixture: ComponentFixture<GridFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FilterService],
      declarations: [GridFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
