import { AfterViewInit, Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  DialogModule,
  ButtonModule,
  FormWrapperModule,
  IconModule,
  TooltipModule,
  SnackbarService,
} from '@oort-front/ui';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';

/**
 * Component to show the deployed version
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    DialogModule,
    FormWrapperModule,
    TooltipModule,
  ],
  selector: 'safe-deployed-version-modal',
  templateUrl: './deployed-version-modal.component.html',
  styleUrls: ['./deployed-version-modal.component.scss'],
})
export class DeployedVersionModalComponent implements AfterViewInit {
  public environment: any;
  public backEndCommitHash = { short: '', long: '' };
  public frontEndCommitHash = { short: '', long: '' };

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param environment This is the environment in which we are running the application
   * @param translate This is the Angular service that translates text
   * @param snackBar Shared snackbar service
   * @param http Angular http client module
   * @param apollo Apollo service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private snackBar: SnackbarService,
    private http: HttpClient,
    private apollo: Apollo
  ) {
    this.environment = environment;
  }

  ngAfterViewInit(): void {
    this.getCommitHash();
  }

  /** retrieves the commit hash from json file */
  getCommitHash() {
    this.http.get('/assets/git-version.json').subscribe((data: any) => {
      this.frontEndCommitHash = { short: data.SHA.slice(0, 9), long: data.SHA };
    });
    this.apollo
      .query<{ latestCommitHash: string }>({
        query: gql`
          query {
            latestCommitHash
          }
        `,
      })
      .subscribe(({ data }) => {
        this.backEndCommitHash = {
          short: data.latestCommitHash.slice(0, 9),
          long: data.latestCommitHash,
        };
      });
  }

  /**
   * Copies the value to the clipboard
   *
   * @param value String to copy to clipboard
   */
  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    this.snackBar.openSnackBar(
      this.translate.instant('components.deployedVersion.copied')
    );
  }
}
