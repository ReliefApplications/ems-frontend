import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeSkeletonTableComponent } from './skeleton-table.component';
import { TableModule } from '@oort-front/ui';

describe('SkeletonTableComponent', () => {
  let component: SafeSkeletonTableComponent;
  let fixture: ComponentFixture<SafeSkeletonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeSkeletonTableComponent],
      imports: [TableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSkeletonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
