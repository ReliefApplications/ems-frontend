import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentAppButtonComponent } from './recent-app-button.component';

describe('RecentAppButtonComponent', () => {
  let component: RecentAppButtonComponent;
  let fixture: ComponentFixture<RecentAppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentAppButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentAppButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
