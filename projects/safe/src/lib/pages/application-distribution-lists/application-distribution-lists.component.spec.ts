import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeApplicationDistributionListsComponent } from './application-distribution-lists.component';

describe('SafeApplicationDistributionListsComponent', () => {
  let component: SafeApplicationDistributionListsComponent;
  let fixture: ComponentFixture<SafeApplicationDistributionListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeApplicationDistributionListsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      SafeApplicationDistributionListsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
