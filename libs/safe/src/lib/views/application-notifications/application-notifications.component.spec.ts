import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeApplicationNotificationsComponent } from './application-notifications.component';

describe('SafeApplicationNotificationsComponent', () => {
  let component: SafeApplicationNotificationsComponent;
  let fixture: ComponentFixture<SafeApplicationNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeApplicationNotificationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
