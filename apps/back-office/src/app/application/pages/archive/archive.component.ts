import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import {
  Application,
  ArchivePage,
  Page,
  SafeApplicationService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';
import { combineLatest, of } from 'rxjs';
import { PreviewService } from '../../../services/preview.service';
import {
  GET_APPLICATION_ARCHIVED_PAGES,
  GetApplicationByIdQueryResponse,
} from './graphql/queries';

/**
 * Archive page component for application preview.
 */
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public itemList: ArchivePage[] = [];

  // === PREVIEWED ROLE ===
  public role = '';

  /**
   * Workflow page component for application preview
   *
   * @param apollo Apollo service
   * @param applicationService SafeApplicationService
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param previewService Shared preview service
   */
  constructor(
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
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
            return this.apollo.query<GetApplicationByIdQueryResponse>({
              query: GET_APPLICATION_ARCHIVED_PAGES,
              variables: {
                id,
                asRole,
                filter: 'archived',
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
          // console.log(data);
          if (data) {
            this.itemList =
              data.application.pages
                ?.filter((page) => page.id && page.name && page.modifiedAt)
                .map((page) => {
                  return {
                    id: page.id,
                    name: page.name,
                    deleteDate: page.modifiedAt,
                  } as ArchivePage;
                }) ?? [];
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.accessNotProvided', {
                type: this.translate
                  .instant('common.workflow.one')
                  .toLowerCase(),
                error: '',
              }),
              { error: true }
            );
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.loading = false;
        },
      });
  }
}
