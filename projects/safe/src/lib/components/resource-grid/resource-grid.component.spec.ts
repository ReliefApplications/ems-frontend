import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeResourceGridComponent } from './resource-grid.component';

// import { SafeResourceGridComponent } from './survey-grid.component';

describe('SafeSurveyGridComponent', () => {
  let component: SafeResourceGridComponent;
  let fixture: ComponentFixture<SafeResourceGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeResourceGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeResourceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
