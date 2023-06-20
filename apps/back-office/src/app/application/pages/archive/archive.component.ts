import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUnsubscribeComponent } from '@oort-front/safe';
import { PreviewService } from '../../../services/preview.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';

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

  // === PREVIEWED ROLE ===
  public role = '';

  /**
   * Workflow page component for application preview
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param previewService Shared preview service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SnackbarService,
    private router: Router,
    private previewService: PreviewService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Gets the workflow from the route.
   */
  ngOnInit(): void {
    // this.previewService.roleId$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((role) => {
    //     this.role = role;
    //   });
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      // this.loading = true;
      // this.id = params.id;
      // this.apollo
      //   .watchQuery<GetWorkflowByIdQueryResponse>({
      //     query: GET_WORKFLOW_BY_ID,
      //     variables: {
      //       id: this.id,
      //       asRole: this.role,
      //     },
      //   })
      //   .valueChanges.subscribe({
      //     next: ({ data, loading }) => {
      //       if (data.workflow) {
      //       } else {
      //         this.snackBar.openSnackBar(
      //           this.translate.instant(
      //             'common.notifications.accessNotProvided',
      //             {
      //               type: this.translate
      //                 .instant('common.workflow.one')
      //                 .toLowerCase(),
      //               error: '',
      //             }
      //           ),
      //           { error: true }
      //         );
      //       }
      //     },
      //     error: (err) => {
      //       this.snackBar.openSnackBar(err.message, { error: true });
      //     },
      //   });
    });
  }
}
