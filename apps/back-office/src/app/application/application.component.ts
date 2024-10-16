import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  ContentType,
  ApplicationService,
  ConfirmService,
  UnsubscribeComponent,
  AppAbility,
} from '@oort-front/shared';
import get from 'lodash/get';
import { takeUntil, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/** Navigation item type */
type NavigationItem = {
  name: string;
  icon: string;
  path: string;
  legacy?: boolean;
};

/**
 * Main component of Application view.
 */
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Application title */
  public title = '';
  /** Navigation groups */
  public navGroups: any[] = [];
  /** Application settings navigation items */
  public appSettingsNavItems: NavigationItem[] = [];
  /** Current application */
  public application?: Application;
  /** Use side menu or not */
  public sideMenu = false;
  /** Should hide menu by default ( only when vertical ) */
  public hideMenu = false;
  /** Is large device */
  public largeDevice: boolean;
  /** Loading indicator */
  public loading = true;
  /**
   * Helper function to create navigation item for application settings
   *
   * @param nameKey Translation key
   * @param path Path to component
   * @param icon Icon to display
   * @param legacy If legacy option
   */
  private addNavItem = (
    nameKey: string,
    path: string,
    icon: string,
    legacy?: boolean
  ) => {
    this.appSettingsNavItems.push({
      name: this.translate.instant(nameKey),
      path: path,
      icon: icon,
      legacy: legacy,
    });
  };

  /**
   * Main component of application view
   *
   * @param applicationService Shared application service
   * @param route Angular activated route
   * @param router Angular router
   * @param translate Angular translate service
   * @param confirmService Shared confirmation service
   * @param ability Shared app ability service
   */
  constructor(
    private applicationService: ApplicationService,
    public route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    private ability: AppAbility
  ) {
    super();
    this.largeDevice = window.innerWidth > 1024;
  }

  /**
   * Build pages navigation item list from the given application
   *
   * @param application Application from to build navigation items
   * @returns Navigation items
   */
  private buildPagesNavItems(application: Application) {
    return (
      application.pages
        ?.filter((x: any) => x.content && x.canSee)
        .map((x: any) => ({
          id: x.id,
          name: x.name,
          path:
            x.type === ContentType.form
              ? `./${x.type}/${x.id}`
              : `./${x.type}/${x.content}`,
          icon: x.icon || this.getNavIcon(x.type || ''),
          fontFamily: x.icon ? 'fa' : 'material',
          class: null,
          orderable: true,
          visible: x.visible ?? true,
          action: x.canDelete && {
            icon: 'delete',
            toolTip: this.translate.instant('common.deleteObject', {
              name: this.translate.instant('common.page.one').toLowerCase(),
            }),
            callback: () => this.onDelete(x),
          },
        })) || []
    );
  }

  /**
   * Build current application settings navigation item list
   */
  private buildAppSettingsNavItems() {
    this.appSettingsNavItems = [];
    this.addNavItem('common.settings', './settings/edit', 'settings');
    this.addNavItem(
      'common.template.few',
      './settings/templates',
      'description',
      true
    );
    this.addNavItem(
      'common.distributionList.few',
      './settings/distribution-lists',
      'mail',
      true
    );
    this.addNavItem(
      'common.user.few',
      './settings/users',
      'supervisor_account'
    );
    this.addNavItem('common.role.few', './settings/roles', 'verified_user');
    this.addNavItem(
      'pages.application.positionAttributes.title',
      './settings/position',
      'edit_attributes'
    );
    if (this.ability.can('read', 'EmailNotification')) {
      this.addNavItem(
        'common.email.notification.few',
        './settings/email-notifications',
        'mail'
      );
    }
    this.addNavItem('common.channel.few', './settings/channels', 'dns');
    this.addNavItem(
      'common.subscription.few',
      './settings/subscriptions',
      'add_to_queue'
    );
    this.addNavItem('common.archive.few', './settings/archive', 'delete');

    // {
    //   name: this.translate.instant('common.customNotification.few'),
    //   path: './settings/notifications',
    //   icon: 'schedule_send',
    // },
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.loading = true;
      this.applicationService.loadApplication(params.id);
    });
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.loading = false;
          this.title = application.name || '';
          if (application.canUpdate) {
            this.buildAppSettingsNavItems();
          }
          this.navGroups = [
            {
              name: this.translate.instant('common.page.few'),
              navItems: this.buildPagesNavItems(application),
            },
          ];
          if (!this.application || application.id !== this.application.id) {
            const firstPage = get(application, 'pages', [])[0];
            if (
              this.router.url.endsWith(application?.id || '') ||
              this.router.url.endsWith(application?.shortcut || '') ||
              !firstPage
            ) {
              if (firstPage) {
                this.router.navigate(
                  [
                    `./${firstPage.type}/${
                      firstPage.type === ContentType.form
                        ? firstPage.id
                        : firstPage.content
                    }`,
                  ],
                  { relativeTo: this.route }
                );
              } else {
                this.router.navigate([`./`], { relativeTo: this.route });
              }
            }
          }
          this.application = application;
          this.sideMenu = this.application?.sideMenu ?? true;
          this.hideMenu = this.application?.hideMenu ?? false;
        } else {
          this.title = '';
          this.navGroups = [];
          if (this.applicationService.hasErrors) {
            this.router.navigate(['/auth/error']);
          }
        }
      });
  }

  /**
   * Get icons from type of page
   *
   * @param type type of page
   * @returns icon as string
   */
  private getNavIcon(type: string): string {
    switch (type) {
      case 'workflow':
        return 'linear_scale';
      case 'form':
        return 'description';
      default:
        return 'dashboard';
    }
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

  /**
   * Delete item, prompt for confirmation
   *
   * @param item item to delete
   */
  onDelete(item: any): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.page.one'),
      }),
      content: this.translate.instant(
        'components.application.pages.delete.confirmationMessage',
        { name: item.name }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.deletePage(item.id);
      }
    });
  }

  /**
   * Reorder pages
   *
   * @param event Reorder event
   */
  onReorder(event: any): void {
    this.applicationService.reorderPages(
      event.filter((x: any) => x.id).map((x: any) => x.id)
    );
  }

  /**
   * Show modal confirmation before leave the page if has changes on custom styling
   *
   * @returns boolean of observable of boolean
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.applicationService.customStyleEdited) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.form.update.exit'),
        content: this.translate.instant(
          'components.widget.settings.close.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      });
      return dialogRef.closed.pipe(
        map((confirm) => {
          if (confirm) {
            return true;
          }
          return false;
        })
      );
    }
    return true;
  }

  /**
   * Remove application data such as styling when existing application edition.
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.applicationService.leaveApplication();
  }
}
