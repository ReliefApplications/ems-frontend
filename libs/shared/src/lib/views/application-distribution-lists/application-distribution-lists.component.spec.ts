import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDistributionListsComponent } from './application-distribution-lists.component';

describe('ApplicationDistributionListsComponent', () => {
  let component: ApplicationDistributionListsComponent;
  let fixture: ComponentFixture<ApplicationDistributionListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationDistributionListsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDistributionListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
