import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoProfileComponent } from './profile.component';

describe('WhoProfileComponent', () => {
  let component: WhoProfileComponent;
  let fixture: ComponentFixture<WhoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
