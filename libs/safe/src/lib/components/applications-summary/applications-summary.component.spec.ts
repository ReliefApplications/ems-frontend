import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationsSummaryComponent } from './applications-summary.component';
import { SafeSkeletonModule } from '../../directives/skeleton/skeleton.module';

describe('SafeApplicationsSummaryComponent', () => {
  let component: SafeApplicationsSummaryComponent;
  let fixture: ComponentFixture<SafeApplicationsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeApplicationsSummaryComponent],
      imports: [SafeSkeletonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
