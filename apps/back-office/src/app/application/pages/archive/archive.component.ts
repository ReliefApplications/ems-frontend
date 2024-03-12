import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import {
  Application,
  ArchivePage,
  Page,
  ApplicationService,
  UnsubscribeComponent,
  ApplicationQueryResponse,
} from '@oort-front/shared';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';
import { combineLatest, of } from 'rxjs';
import { PreviewService } from '../../../services/preview.service';
import { GET_APPLICATION_ARCHIVED_PAGES } from './graphql/queries';

/**
 * Archive page component for application preview.
 */
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent extends UnsubscribeComponent implements OnInit {
  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Application pages */
  public pages: ArchivePage[] = [];

  // === PREVIEWED ROLE ===
  /** Current previewed role */
  public role = '';

  /**
   * Workflow page component for application preview
   *
   * @param apollo Apollo service
   * @param applicationService Shared ApplicationService
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param previewService Shared preview service
   */
  constructor(
    private apollo: Apollo,
    private applicationService: ApplicationService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private previewService: PreviewService
  ) {
    super();
  }

  ngOnInit(): void {
    const applicationStream$ = combineLatest([
      this.applicationService.application$.pipe(
        filter(Boolean),
        map((application: Application) => application.id ?? null)
      ),
      this.previewService.roleId$,
    ]);
    applicationStream$
      .pipe(
        switchMap(([id, asRole]) => {
          if (id !== null) {
            return this.apollo.query<ApplicationQueryResponse>({
              query: GET_APPLICATION_ARCHIVED_PAGES,
              variables: {
                id,
                asRole,
              },
            });
          } else {
            return of({ data: { application: { pages: [] as Page[] } } });
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ data }) => {
          if (data) {
            this.pages =
              (data.application.pages || []).map((page) => {
                return {
                  id: page.id,
                  name: page.name,
                  autoDeletedAt: page.autoDeletedAt,
                } as ArchivePage;
              }) ?? [];
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.accessNotProvided', {
              type: this.translate.instant('common.workflow.one').toLowerCase(),
              error: '',
            }),
            { error: true }
          );
        },
      });
  }
}
