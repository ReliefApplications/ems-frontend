import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTabComponent } from './navigation-tab.component';

describe('NavigationTabComponent', () => {
  let component: NavigationTabComponent;
  let fixture: ComponentFixture<NavigationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
