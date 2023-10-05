import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonDirective } from './skeleton.directive';

/**
 * Host component to use the directive on
 */
@Component({
  template: `<ng-container
    *sharedSkeleton
    [loading]="true"
    [repeat]="10"
  ></ng-container>`,
})
class TestComponent {}

describe('SkeletonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SkeletonDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });
  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
