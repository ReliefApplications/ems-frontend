import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeSkeletonDirective } from './skeleton.directive';

/**
 * Host component to use the directive on
 */
@Component({
  template: `<ng-container
    *safeSkeleton
    [loading]="true"
    [repeat]="10"
  ></ng-container>`,
})
class TestComponent {}

describe('SafeSkeletonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SafeSkeletonDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });
  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
