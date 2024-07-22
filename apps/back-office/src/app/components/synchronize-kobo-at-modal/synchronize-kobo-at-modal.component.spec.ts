import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizeKoboAtModalComponent } from './synchronize-kobo-at-modal.component';

describe('SynchronizeKoboAtModalComponent', () => {
  let component: SynchronizeKoboAtModalComponent;
  let fixture: ComponentFixture<SynchronizeKoboAtModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynchronizeKoboAtModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SynchronizeKoboAtModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
