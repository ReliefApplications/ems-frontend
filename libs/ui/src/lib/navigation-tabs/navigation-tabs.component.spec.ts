import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTabsComponent } from './navigation-tabs.component';

describe('NavigationTabComponent', () => {
  let component: NavigationTabsComponent;
  let fixture: ComponentFixture<NavigationTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
