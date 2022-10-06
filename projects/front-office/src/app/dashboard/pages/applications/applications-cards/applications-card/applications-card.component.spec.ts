import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsCardComponent } from './applications-card.component';

describe('CardComponent', () => {
  let component: ApplicationsCardComponent;
  let fixture: ComponentFixture<ApplicationsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
