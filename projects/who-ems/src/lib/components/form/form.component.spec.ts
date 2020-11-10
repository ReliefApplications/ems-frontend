import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoFormComponent } from './form.component';

describe('WhoFormComponent', () => {
  let component: WhoFormComponent;
  let fixture: ComponentFixture<WhoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
