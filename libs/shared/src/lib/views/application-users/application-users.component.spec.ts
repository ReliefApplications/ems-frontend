import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationUsersComponent } from './application-users.component';

describe('ApplicationUsersComponent', () => {
  let component: ApplicationUsersComponent;
  let fixture: ComponentFixture<ApplicationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
