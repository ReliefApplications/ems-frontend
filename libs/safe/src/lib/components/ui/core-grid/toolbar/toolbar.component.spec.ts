import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeGridToolbarComponent } from './toolbar.component';

describe('SafeGridToolbarComponent', () => {
  let component: SafeGridToolbarComponent;
  let fixture: ComponentFixture<SafeGridToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeGridToolbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeGridToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
