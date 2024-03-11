import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { EmailService } from '../../email.service';
import { Subscription } from 'rxjs';

/**
 * The preview component is used to display the email layout using user input from layout component.
 */
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {
  /** Selected resource ID. -TO DELETE? */
  public selectedResourceId: string | undefined = '653642baa37293bb1706506e';

  /** List of data items. -TO DELETE? */
  public dataList!: { [key: string]: string }[];

  /** List of keys for data items. -TO DELETE? */
  public dataListKey!: { [key: string]: string }[];
  /** HEADER LOGO FILE SRC STRING */
  public headerLogo: string | ArrayBuffer | null = null;
  /** BANNER IMAGE FILE SRC STRING */
  public bannerImage: string | ArrayBuffer | null = null;
  /** FOOTER LOGO FILE SRC STRING */
  public footerLogo: string | ArrayBuffer | null = null;
  /** SUBJECT STRING */
  public subjectString: string | any =
    this.emailService.allLayoutdata.txtSubject;
  /** BODY HTML STRING */
  public bodyString: string | any = this.emailService.allLayoutdata.bodyHtml;
  /** HEADER HTML STRING */
  public headerString: string | any =
    this.emailService.allLayoutdata.headerhtml;
  /** FOOTER HTML STRING */
  public footerString: string | any =
    this.emailService.allLayoutdata.footerHtml;

  /** Subscription for query. */
  private querySubscription: Subscription | null = null;

  /**
   * Creates an instance of PreviewComponent.
   *
   * @param apollo - The Apollo client for making GraphQL queries.
   * @param emailService - The service for email-related operations.
   */
  constructor(private apollo: Apollo, public emailService: EmailService) {}

  ngOnInit(): void {
    this.replaceTokensWithTables();
    this.replaceDateTimeTokens();

    (document.getElementById('subjectHtml') as HTMLInputElement).innerHTML =
      this.subjectString;

    (document.getElementById('headerHtml') as HTMLInputElement).innerHTML =
      this.headerString;

    (document.getElementById('bodyHtml') as HTMLInputElement).innerHTML =
      this.bodyString;

    if (this.emailService.allLayoutdata.headerLogo) {
      if (this.emailService.allLayoutdata.headerLogo.__zone_symbol__value) {
        this.headerLogo = URL.createObjectURL(
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.headerLogo.__zone_symbol__value,
            'image.png',
            'image/png'
          )
        );
      } else {
        this.headerLogo = URL.createObjectURL(
          this.emailService.allLayoutdata.headerLogo
        );
      }
    }

    if (this.emailService.allLayoutdata.footerLogo) {
      if (this.emailService.allLayoutdata.footerLogo.__zone_symbol__value) {
        this.footerLogo = URL.createObjectURL(
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.footerLogo.__zone_symbol__value,
            'image.png',
            'image/png'
          )
        );
      } else {
        this.footerLogo = URL.createObjectURL(
          this.emailService.allLayoutdata.footerLogo
        );
      }
    }

    if (this.emailService.allLayoutdata.bannerImage) {
      if (this.emailService.allLayoutdata.bannerImage.__zone_symbol__value) {
        this.bannerImage = URL.createObjectURL(
          this.emailService.convertBase64ToFile(
            this.emailService.allLayoutdata.bannerImage.__zone_symbol__value,
            'image.png',
            'image/png'
          )
        );
      } else {
        this.bannerImage = URL.createObjectURL(
          this.emailService.allLayoutdata.bannerImage
        );
      }
    }

    (document.getElementById('footerHtml') as HTMLInputElement).innerHTML =
      this.footerString;
  }

  /**
   * Replaces Subject Tokens with data from the first row of data.
   */
  replaceSubjectTokens() {
    const tokenRegex = /{{([^}]+)}}/g;
    let match;
    const firstRowData = this.emailService.allPreviewData[0]?.dataList[0];
    while ((match = tokenRegex.exec(this.subjectString)) !== null) {
      const fieldName = match[1];
      const fieldValue = firstRowData[fieldName];

      if (fieldValue !== undefined) {
        this.subjectString = this.subjectString.replace(match[0], fieldValue);
      }
    }
  }

  /**
   * Retrieves the style based on the item name then sets the style in the email service.
   *
   * @param item The item you are retrieving the inline styling of.
   * @returns The inline styling of the item.
   */
  getEmailStyle(item: string): string {
    const styles: { [key: string]: string } = {}; // Define the type of the styles object
    switch (item) {
      case 'bannerImage':
        styles[
          'bannerImageStyle'
        ] = `max-width: 100%; height: auto; object-fit: contain; padding-bottom: 0.5rem; align-items: center;`;
        break;
      case 'header':
        styles[
          'headerStyle'
        ] = `margin: 0 auto; display: flex; width: 100%; background-color: ${this.emailService.allLayoutdata.headerBackgroundColor};`;
        break;
      case 'headerLogo':
        styles[
          'headerLogoStyle'
        ] = `margin: 0.5rem; display: block; width: 15%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.emailService.allLayoutdata.headerBackgroundColor};`;
        break;
      case 'headerHtml':
        styles[
          'headerHtmlStyle'
        ] = `text-align: center; margin: 0.5rem auto; padding: 0.5rem; width: 80%; overflow: hidden; background-color: ${this.emailService.allLayoutdata.headerBackgroundColor}; color: ${this.emailService.allLayoutdata.headerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`;
        break;
      case 'body':
        styles[
          'bodyStyle'
        ] = `text-align: center; padding: 0.5rem; padding-top: 1rem; width: 100%; overflow-x: auto; background-color: ${this.emailService.allLayoutdata.bodyBackgroundColor}; color: ${this.emailService.allLayoutdata.bodyTextColor}; flex-grow: 1;`;
        break;
      case 'footer':
        styles[
          'footerStyle'
        ] = `display: flex; width: 100%; background-color: ${this.emailService.allLayoutdata.footerBackgroundColor};`;
        break;
      case 'footerImg':
        styles[
          'footerImgStyle'
        ] = `margin: 0.5rem; display: block; width: 20%; padding: 0.25rem 0.5rem; border-radius: 0.375rem; background-color: ${this.emailService.allLayoutdata.footerBackgroundColor};`;
        break;
      case 'footerHtml':
        styles[
          'footerHtmlStyle'
        ] = `width: 80%; padding-top: 1rem; overflow: hidden; background-color: ${this.emailService.allLayoutdata.footerBackgroundColor}; color: ${this.emailService.allLayoutdata.footerTextColor}; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`;
        break;
      case 'copyright':
        styles[
          'copyrightStyle'
        ] = `text-align: center; width: 100%; padding-top: 0.5rem; padding-bottom: 0.5rem; box-sizing: border-box; background-color: #00205C; color: white; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif; margin-top: auto;`;
        break;

      case 'container':
        styles[
          'containerStyle'
        ] = `border: 2px solid #00205C; width: 100%; height: 100%; box-sizing: border-box; display: flex; flex-direction: column;`;
        break;
      default:
        return '';
    }
    this.emailService.setEmailStyles(styles);
    return styles[item + 'Style'] || '';
  }

  /**
   * Retrieves the table object based on the item name then sets the style in the email service.
   *
   * @param item The table part you are retrieving the inline styling of.
   * @returns The inline style of the item.
   */
  getTableStyle(item: string): string {
    const styles: { [key: string]: string } = {};
    switch (item) {
      case 'tableDiv':
        styles[
          'tableDivStyle'
        ] = `display: flex; flex-direction: column; align-items: center; width: 90%; margin: 0 auto; margin-top: 1rem;`;
        break;
      case 'label':
        styles[
          'labelStyle'
        ] = `display: block; text-align: left; padding-left: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; width: 100%; font-size: 0.875rem; line-height: 1.25rem; font-family: 'Source Sans Pro', sans-serif; background-color: #00205C; color: white; font-style: normal; font-weight: 700;`;
        break;
      case 'table':
        styles['tableStyle'] =
          'width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; overflow:auto; padding-left: 1.25rem; padding-top: 0.5rem; padding-bottom: 0.5rem; padding-right: 0.5rem;';
        break;
      case 'thead':
        styles[
          'theadStyle'
        ] = `background-color: #00205C; color: white; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`;
        break;
      case 'tbody':
        styles['tbodyStyle'] = `font-size: 14px;`;
        break;
      case 'th':
        styles['thStyle'] =
          'text-align: center; padding: 0.5rem; background-color: #00205C; color: white;';
        break;
      case 'tr':
        styles['trStyle'] =
          'border-top: 1px solid #d1d5db; background-color: white;';
        break;
      case 'td':
        styles[
          'tdStyle'
        ] = `padding: 0.5rem; text-align: center; font-family: 'Source Sans Pro', Roboto, 'Helvetica Neue', sans-serif;`;
        break;
    }
    this.emailService.setTableStyles(styles);
    return styles[item + 'Style'] || '';
  }

  /**
   * This function formats the date and time in a readable format
   * for in the last.
   *
   * @param minutes The in the last number and unit converted to minutes
   * @returns The formatted date and time.
   */
  formatInLastString(minutes: number): string {
    const currentDate = new Date();
    // Multiplied by 60000 to convert minutes to milliseconds (to match getTime)
    const currentDateUTC = new Date(
      currentDate.getTime() + currentDate.getTimezoneOffset() * 60000
    );

    // Current date offset by minutes param
    const pastDateUTC = new Date(currentDateUTC.getTime() - minutes * 60000);

    // Past Date in date format (mm/dd/yyyy)
    const formattedPastDate = pastDateUTC.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });

    // Past Date in time format (hh:mm)
    const formattedPastTime = pastDateUTC.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Current Date in date format (mm/dd/yyyy)
    const formattedCurrentDate = currentDateUTC.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });

    // Current Date in time format (hh:mm)
    const formattedCurrentTime = currentDateUTC.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // If minutes is greater than a week then set past time as current time
    const minutesInAWeek = 7 * 24 * 60;
    if (minutes > minutesInAWeek) {
      return `From ${formattedPastDate} ${formattedCurrentTime} UTC as of ${formattedCurrentDate} ${formattedCurrentTime} UTC`;
    }

    return `From ${formattedPastDate} ${formattedPastTime} UTC as of ${formattedCurrentDate} ${formattedCurrentTime} UTC`;
  }

  /**
   * This function replaces certain in the last tokens in the header string.
   *
   * @param headerString The current header text value.
   */
  replaceInTheLast(headerString: string | any): void {
    // Token matching {{String.String.number}}
    const tokenRegex = /{{([^}]+)\.([^}]+)\.(\d+)}}/g;
    let match;
    while ((match = tokenRegex.exec(headerString)) !== null) {
      // Extract the unitInMinutes from the token
      const unitInMinutes = Number(match[3]);
      const formattedDateTime = this.formatInLastString(unitInMinutes);
      // Replace the entire token with the formatted date and time
      headerString = headerString.replace(match[0], formattedDateTime);
    }
    this.headerString = headerString;
  }

  /**
   * Parses the email body string and replaces dataset tokens with corresponding HTML tables.
   */
  replaceTokensWithTables(): void {
    this.bodyString = this.emailService.allLayoutdata.bodyHtml;
    // Token matching {{String}}
    const tokenRegex = /{{([^}]+)}}/g;
    let match;
    while ((match = tokenRegex.exec(this.bodyString)) !== null) {
      const tabName = match[1]; // Extract the tab name from the token
      const previewData = this.emailService.allPreviewData.find(
        (data) => data.tabName === tabName
      );

      if (previewData) {
        const tableHtml = this.convertPreviewDataToHtml(previewData);
        this.bodyString = this.bodyString.replace(match[0], tableHtml);
      }
    }
  }

  /**
   * Replaces time tokens with string value for both header and footer.
   */
  replaceDateTimeTokens(): void {
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();
    const dateTimeString = currentDate.toLocaleString();

    // Tokens to match
    const tokens = {
      '{{today.date}}': dateString,
      '{{now.datetime}}': dateTimeString,
      '{{now.time}}': timeString,
    };

    this.subjectString = this.emailService.allLayoutdata.txtSubject;
    if (this.subjectString) {
      Object.entries(tokens).forEach(([token, value]) => {
        this.subjectString = this.subjectString.replace(
          new RegExp(token, 'g'),
          value
        );
      });
      this.replaceSubjectTokens();
    } else {
      this.subjectString = '';
    }

    this.headerString = this.emailService.allLayoutdata.headerHtml;
    if (this.headerString) {
      Object.entries(tokens).forEach(([token, value]) => {
        this.headerString = this.headerString?.replace(
          new RegExp(token, 'g'),
          value
        );
      });
      this.replaceInTheLast(this.headerString);
    } else {
      this.headerString = '';
    }

    this.footerString = this.emailService.allLayoutdata.footerHtml;
    if (this.footerString) {
      Object.entries(tokens).forEach(([token, value]) => {
        this.footerString = this.footerString.replace(
          new RegExp(token, 'g'),
          value
        );
      });
    } else {
      this.footerString = '';
    }
  }

  /**
   * Converts the given preview data into an HTML table representation.
   *
   * @param previewData The data to be converted into an HTML table.
   * @returns An HTML string representing the data as a table.
   */
  convertPreviewDataToHtml(previewData: any): string {
    if (!previewData?.dataList?.length) {
      return `
      <div style="${this.getTableStyle('tableDiv')}">
        <div style="width: 100%;">
          <label style="${this.getTableStyle('label')}">
          ${previewData.tabName}</label>
        </div>
        <div style="width: 100%; overflow-x: auto;">
          <table style="${this.getTableStyle('table')};">
            <tbody style="${this.getTableStyle('tbody')}">
              <tr style="${this.getTableStyle('tr')}">
                <td style="${this.getTableStyle('td')}">no data found</td>
              <tr>
            </tbody>
          </table>
        </div>
      </div>`;
    }

    const theadHtml = previewData.dataSetFields
      .map(
        (fieldKeyString: any) =>
          `<th style="${this.getTableStyle(
            'th'
          )}">${this.emailService.replaceUnderscores(fieldKeyString)}</th>`
      )
      .join('');

    const tbodyHtml = previewData.dataList
      .map(
        (data: any) =>
          `<tr style="${this.getTableStyle('tr')}">${previewData.dataSetFields
            .map(
              (fieldKeyString: any) =>
                `<td style="${this.getTableStyle('td')}">${
                  data[fieldKeyString] ? data[fieldKeyString] : ''
                }</td>`
            )
            .join('')}</tr>`
      )
      .join('');

    const tableHtml = `
  <div style="${this.getTableStyle('tableDiv')}">
    <label style="${this.getTableStyle('label')}">${previewData.tabName}</label>
    <div style="width: 100%; overflow-x: auto;">
      <table style="${this.getTableStyle('table')}" class="dataset-preview">
        <thead style="${this.getTableStyle('thead')}">
          <tr style="${this.getTableStyle('tr')}">
            ${theadHtml}
          </tr>
        </thead>
        <tbody style="${this.getTableStyle('tbody')}">
          ${tbodyHtml}
        </tbody>
      </table>
    </div>
  </div>
`;
    return tableHtml;
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    this.emailService.patchTableStyles();
  }
}
