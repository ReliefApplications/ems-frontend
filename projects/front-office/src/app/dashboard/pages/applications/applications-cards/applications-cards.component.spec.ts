import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsCardsComponent } from './applications-cards.component';

describe('CardsComponent', () => {
  let component: ApplicationsCardsComponent;
  let fixture: ComponentFixture<ApplicationsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationsCardsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
