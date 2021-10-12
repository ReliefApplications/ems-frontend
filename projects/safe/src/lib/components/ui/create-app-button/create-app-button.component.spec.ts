import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAppButtonComponent } from './create-app-button.component';

describe('CreateAppButtonComponent', () => {
  let component: CreateAppButtonComponent;
  let fixture: ComponentFixture<CreateAppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAppButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
