import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'safe-import-record-modal',
  templateUrl: './import-record-modal.component.html',
  styleUrls: ['./import-record-modal.component.css']
})
export class ImportRecordModalComponent implements OnInit {

  files: File[] = [];
  formDataFile: FormData[] = [];
  baseUrl: string;

  constructor(private http: HttpClient, @Inject('environment') environment: any) {
    this.baseUrl = environment.API_URL;
  }

  ngOnInit(): void {
  }

  onSelect(event: any): void {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event: any): void {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  sendFiles(event: any): void {
    console.log('send');

    const path = 'upload/records/add';
    const url = path.startsWith('http') ? path : `${this.baseUrl}/${path}`;
    const token = localStorage.getItem('msal.idtoken');
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    });

    let testData;
    // for (const f of this.files) {
    //   console.log(f);
    //   testData = new FormData();
    //   testData.append('file_upload', f, f.name);
    //   // testData.set('file', f, f.name);
    //   console.log(testData);
    //   this.formDataFile.push(testData);
    // }
    console.log(this.files[0]);
    testData = new FormData();
    testData.append('file_upload', this.files[0], this.files[0].name);

    this.http.post(url, testData, {headers}).subscribe(response => {
      console.log(response);
    });

    // this.formDataFile = [] ;

    // this.http.get('http://localhost:3000/upload/hello/boi', { responseType: 'json', headers}).subscribe((res) => {
    //   console.log(res);
    // } );
  }
}
