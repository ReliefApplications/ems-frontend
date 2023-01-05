import {
  Component,
  OnInit,
  Input,
  Inject,
  OnChanges,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { SafeAuthService } from '../../services/auth/auth.service';
import { PermissionsManagement, PermissionType } from '../../models/user.model';
import { Router } from '@angular/router';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * The left side navigator used in the main layout
 */
@Component({
  selector: 'safe-left-sidenav',
  templateUrl: './left-sidenav.component.html',
  styleUrls: ['./left-sidenav.component.scss'],
})
export class SafeLeftSidenavComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnChanges
{
  @Input() appLayout = false;
  @Input() canAddPage = false;
  @Output() reorder: EventEmitter<any> = new EventEmitter();

  // === NAVIGATION GROUP ===
  @Input() navGroups: any[] = [];
  @Input() nav: any;
  public filteredNavGroups: any[] = [];

  private inApplication = false;
  private environment: any;

  // === DISPLAY ===
  public largeDevice: boolean;

  /**
   * Left sidenav visible in application edition and preview.
   *
   * @param environment This is the environment in which we are running the application
   * @param router The Angular Router service
   * @param authService This is the service that handles authentication
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private authService: SafeAuthService
  ) {
    super();
    this.environment = environment;
    this.largeDevice = window.innerWidth > 1024;
  }

  ngOnInit(): void {
    if (this.environment.module === 'backoffice') {
      this.inApplication = this.router.url.includes('/applications/');
    }
    this.loadUserAndUpdateLayout();
  }

  ngOnChanges(): void {
    this.loadUserAndUpdateLayout();
  }

  /**
   * Load the user and update availables navGroups accordingly
   */
  private loadUserAndUpdateLayout(): void {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item: any) => {
          if (this.inApplication) {
            return true;
          }
          const permission = PermissionsManagement.getRightFromPath(
            item.path,
            PermissionType.access
          );
          return this.authService.userHasClaim(
            permission,
            this.environment.module === 'backoffice'
          );
        });
        if (navItems.length > 0 || (this.appLayout && this.canAddPage)) {
          const filteredGroup = {
            name: group.name,
            callback: group.callback,
            navItems,
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
  }

  /**
   * Handles the click event
   *
   * @param callback Callback that defines the action to perform on click
   * @param event Event that happends with the click
   */
  onClick(callback: () => any, event: any): void {
    callback();
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Drop event handler. Move item in layout navigation item list.
   *
   * @param event drop event
   * @param group group where the event occurs
   */
  drop(event: any, group: any): void {
    moveItemInArray(group.navItems, event.previousIndex, event.currentIndex);
    this.reorder.emit(group.navItems);
  }

  /**
   * Change the display depending on windows size.
   *
   * @param event Event that implies a change in window size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.largeDevice = event.target.innerWidth > 1024;
  }
}
