import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { WhoAuthService } from '../../services/auth.service';
import { Account } from 'msal';
import { PermissionsManagement, PermissionType } from '../../models/user.model';
import { Application } from '../../models/application.model';

@Component({
  selector: 'who-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class WhoLayoutComponent implements OnInit, OnChanges {

  // === HEADER TITLE ===
  @Input() title: string;

  @Input() navGroups: any[];

  @Input() applications: Application[];

  @Output() openApplication: EventEmitter<Application> = new EventEmitter();

  filteredNavGroups = [];

  // === AZURE ACCOUNT ===
  account: Account;

  // === DISPLAY ===
  public largeDevice: boolean;

  constructor(
    private authService: WhoAuthService
  ) {
    this.largeDevice = (window.innerWidth > 1024);
    this.account = this.authService.account;
  }

  ngOnInit(): void {
    this.authService.user.subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item) => {
          const permission = PermissionsManagement.getRightFromPath(item.path, PermissionType.access);
          return this.authService.userHasClaim(permission);
        });
        if (navItems.length > 0) {
          const filteredGroup = {
            name: group.name,
            navItems
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
  }

  ngOnChanges(): void {
    this.authService.user.subscribe(() => {
      this.filteredNavGroups = [];
      for (const group of this.navGroups) {
        const navItems = group.navItems.filter((item) => {
          const permission = PermissionsManagement.getRightFromPath(item.path, PermissionType.access);
          return this.authService.userHasClaim(permission);
        });
        if (navItems.length > 0) {
          const filteredGroup = {
            name: group.name,
            navItems
          };
          this.filteredNavGroups.push(filteredGroup);
        }
      }
    });
  }

  /*  Change the display depending on windows size.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.largeDevice = (event.target.innerWidth > 1024);
  }

  /* Emit the application to open
  */
  onOpenApplication(application: Application): void {
    this.openApplication.emit(application);
  }

  /*  Call logout method of authService.
    */
  logout(): void {
    this.authService.logout();
  }

}
