import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  private templatesUrl = '';
  public templates: any = [];

  /**
   * Constructor for safe-add-card constructor
   *
   * @param environment Injection of the environment file.
   * @param http Angular http client
   * @param dialogRef material dialog reference of the component
   * @param data the data passed into the dialog
   * @param data.isDynamic wether the added card will be dynamic or not
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
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    await this.http
      .get(this.templatesUrl, { headers })
      .toPromise()
      .then((data: any) => {
        this.templates = data;
      });
    this.templates = this.templates.slice(-3).reverse();
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
    this.dialogRef.close(item);
  }
}
