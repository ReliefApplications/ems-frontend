import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAppButtonComponent } from './new-app-button.component';

describe('CreateAppButtonComponent', () => {
  let component: NewAppButtonComponent;
  let fixture: ComponentFixture<NewAppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAppButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAppButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
