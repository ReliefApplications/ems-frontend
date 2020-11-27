import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationModalComponent } from './application-modal.component';

describe('ApplicationModalComponent', () => {
  let component: ApplicationModalComponent;
  let fixture: ComponentFixture<ApplicationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
