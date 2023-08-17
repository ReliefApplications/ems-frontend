import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeBadgeComponent } from './badge.component';

describe('SafeBadgeComponent', () => {
  let component: SafeBadgeComponent;
  let fixture: ComponentFixture<SafeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
