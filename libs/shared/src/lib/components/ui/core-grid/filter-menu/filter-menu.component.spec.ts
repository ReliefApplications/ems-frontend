import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { GridFilterMenuComponent } from './filter-menu.component';

describe('GridFilterMenuComponent', () => {
  let component: GridFilterMenuComponent;
  let fixture: ComponentFixture<GridFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder],
      declarations: [GridFilterMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFilterMenuComponent);
    component = fixture.componentInstance;
    component.filter = {
      logic: null,
      filters: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
