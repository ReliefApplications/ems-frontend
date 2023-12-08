import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsSummaryComponent } from './applications-summary.component';

describe('ApplicationsSummaryComponent', () => {
  let component: ApplicationsSummaryComponent;
  let fixture: ComponentFixture<ApplicationsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
