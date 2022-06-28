import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationToolbarComponent } from './application-toolbar.component';

describe('ApplicationToolbarComponent', () => {
  let component: ApplicationToolbarComponent;
  let fixture: ComponentFixture<ApplicationToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationToolbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
