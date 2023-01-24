import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

/**
 * The component is used on a card creation in the summary-card widget
 */
@Component({
  selector: 'safe-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class SafeAddCardComponent implements OnInit {
  @Input() isDynamic: any;
  public loading = true;
  private templatesUrl = '';
  public templates: any = [];
  public searchControl = new UntypedFormControl('');

  /**
   * Constructor for safe-add-card constructor
   *
   * @param dialogRef material dialog reference of the component
   * @param environment Injection of the environment file.
   * @param data the data passed into the dialog
   * @param data.isDynamic wether the added card will be dynamic or not
   * @param http Angular http client
   */
  constructor(
    public dialogRef: MatDialogRef<SafeAddCardComponent>,
    @Inject('environment') environment: any,
    @Inject(MAT_DIALOG_DATA) public data: { isDynamic: any },
    private http: HttpClient
  ) {
    this.templatesUrl = environment.apiUrl + '/summarycards/templates/';
  }

  async ngOnInit(): Promise<void> {
    this.getTemplates();
    this.searchControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((res) => {
        this.getTemplates(res);
      });
  }

  /**
   * Query a list of templates
   *
   * @param search (optional) search text
   */
  private getTemplates(search?: string): void {
    this.loading = true;
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = {
      ...(search && { search }),
    };
    firstValueFrom(this.http.get(this.templatesUrl, { headers, params })).then(
      (data: any) => {
        this.templates = data.slice(-3).reverse();
        this.loading = false;
      }
    );
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending the modal data.
   */
  onCreate(): void {
    this.dialogRef.close(this.data);
  }

  /**
   * Closes the modal when a template is selected, sending the modal data.
   *
   * @param item The summary card template item chosen
   */
  onCreateFromTemplate(item: any): void {
    // remove record when using static template to create a dynamic card.
    if (this.data.isDynamic && !item.isDynamic) {
      item.record = null;
    }
    item.isDynamic = this.data.isDynamic;
    this.dialogRef.close(item);
  }
}
