import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeIntersectionObserverComponent } from './intersection-observer.component';

describe('SafeIntersectionObserverComponent', () => {
  let component: SafeIntersectionObserverComponent;
  let fixture: ComponentFixture<SafeIntersectionObserverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeIntersectionObserverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeIntersectionObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
