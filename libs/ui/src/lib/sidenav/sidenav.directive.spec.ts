import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavDirective } from './sidenav.directive';
import { SidenavTypes } from './types/sidenavs';

/**
 * Component for testing purposes
 */
@Component({
  template: `
    <!-- Never set as relative, while we use kendo tile layouts for widget grid -->
    <div
      [ngClass]="{ flex: mode[0] === 'side' }"
      class="w-screen overflow-y-auto"
    >
      <!-- SIDENAV CONTENT -->
      <ng-container *ngFor="let sidenav of uiSidenavDirective; let i = index">
        <div
          #sidenav
          class="will-change-transform overflow-y-auto bg-white translate-x-0"
          [attr.data-sidenav-show]="showSidenav[i]"
          [ngClass]="resolveSidenavClasses(i)"
          [style.height]="height"
        >
          <div class="flex flex-col h-full"></div>
        </div>
      </ng-container>
      <!-- CONTENT -->
      <div class="flex-1 overflow-y-auto" #contentContainer>
        <div
          [ngClass]="{
            'visible bg-black opacity-50': showSidenav[0] && mode[0] === 'over',
            'invisible bg-transparent': !showSidenav[0] || mode[0] === 'side'
          }"
          class="block w-full overflow-y-auto min-h-full transition-visibility duration-500 transition-all ease-in-out absolute inset-0 pointer-events-none z-[998]"
        ></div>
        <div class="py-[32px] overflow-y-auto h-full px-[24px]" #contentWrapper>
          <ng-content select="content"></ng-content>
        </div>
      </div>
    </div>
  `,
})
class TestingComponent {
  public showSidenav: boolean[] = [];
  public mode: SidenavTypes[] = [];
}

describe('SidenavDirective', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  let component: TestingComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [SidenavDirective, TestingComponent],
    }).createComponent(TestingComponent);

    fixture.detectChanges(); // initial binding

    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
