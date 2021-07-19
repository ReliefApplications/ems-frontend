import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SafeDownloadService} from '../../../../safe/src/lib/services/download.service';
import {Apollo} from 'apollo-angular';
import {GET_FORM_BY_ID, GetFormByIdQueryResponse} from '../graphql/queries';
import {ADD_RECORD, AddRecordMutationResponse} from '../graphql/mutations';
// import {ADD_RECORD, AddRecordMutationResponse} from '../../../../../dist/safe/lib/graphql/mutations';

@Component({
  selector: 'app-virtual-assistant',
  templateUrl: './virtual-assistant.component.html',
  styleUrls: ['./virtual-assistant.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualAssistantComponent implements OnInit {

  // === DATA ===
  public id = '';
  public form: any;
  public td: {title: string, description: string};
  public iQuestion: any;
  public messages: any;
  public vaCols: number;
  public chatCols: number;

  public start: boolean;
  public startBtn: boolean;
  public loadingForm: boolean;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  constructor(private route: ActivatedRoute,
              private downloadService: SafeDownloadService,
              private apollo: Apollo) {
    // this.vaCols = 6;
    this.vaCols = 2;
    this.chatCols = 0;
    this.iQuestion = 0;

    this.start = false;
    this.startBtn = false;
    this.loadingForm = true;

    this.td = {
      title: '',
      description: ''
    };
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      console.log('this.id');
      console.log(this.id);
      this.getForm();
    });
  }

  async getForm(): Promise<void>{
    // const path = `download/form/${this.id}`;
    // const dataReturn = await this.downloadService.getForm(path);
    // if (dataReturn.status === true) {
    //   // console.log(JSON.parse(dataReturn.data.structure));
    //   this.form = JSON.parse(dataReturn.data.structure).pages[0].elements;
    //   console.log('this.form');
    //   console.log(this.form);
    // }
    // else {
    //   // problem with the form
    // }

    // this.apollo.watchQuery<GetFormsQueryResponse>({
    //   query: GET_SHORT_FORMS,
    // }).valueChanges.subscribe((res: any) => {
    //   console.log('Apollo: res.data.forms');
    //   console.log(res.data.forms);
    // });

    this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_FORM_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res: any) => {
      console.log('APOLLO: res.data.form');
      console.log(res);
      const formStruct = JSON.parse(res.data.form.structure).pages[0];
      this.form = formStruct.elements;
      if (formStruct.title !== undefined){
        console.log(JSON.parse(res.data.form.structure).pages[0].title);
        this.td.title = formStruct.title;
      }
      if (formStruct.description !== undefined){
        console.log(formStruct.description);
        this.td.description = formStruct.description;
      }
      console.log(this.form);
      this.startBtn = true;
      this.loadingForm = false;
    });
  }

  // onChatButton(event: any): void {
  //   console.log('onChatButton');
  //   if (this.vaCols !== 6) {
  //     this.vaCols = 6;
  //   }
  //   else {
  //     this.vaCols = 12;
  //   }
  // }

  vaEndConversation(records: any): void {
    console.log('vaEndConversation');
    console.log(records);
    for (const r of records){
      console.log(r);
      this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.id,
          data: r
        }
      }).subscribe((res) => {
        console.log(res);
        window.close();
      });
    }
  }

  btnStartClick(): void {
    this.vaCols = 1;
    this.chatCols = 1;
    this.start = true;
    this.startBtn = false;
  }
}
