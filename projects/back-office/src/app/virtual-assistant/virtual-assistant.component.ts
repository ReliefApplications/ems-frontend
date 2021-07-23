import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SafeDownloadService} from '../../../../safe/src/lib/services/download.service';
import {Apollo} from 'apollo-angular';
import {GET_FORM_BY_ID, GetFormByIdQueryResponse} from '../graphql/queries';
import {ADD_RECORD, AddRecordMutationResponse} from '../graphql/mutations';

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

  public start: boolean;
  public startBtn: boolean;
  public loadingForm: boolean;

  public voiceLanguage: {value: string, text: string}[];
  public curLanguage: string;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  constructor(private route: ActivatedRoute,
              private downloadService: SafeDownloadService,
              private apollo: Apollo) {
    this.iQuestion = 0;

    this.start = false;
    this.startBtn = false;
    this.loadingForm = true;

    this.td = {
      title: '',
      description: ''
    };

    // tslint:disable-next-line:max-line-length
    // this.voiceLanguage = ['ar-SA', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en', 'en-AU', 'en-GB', 'en-IE', 'en-IN', 'en-US', 'en-ZA', 'es-AR',
    // tslint:disable-next-line:max-line-length
    //   'es-ES', 'es-MX', 'es-US', 'fi-FI', 'fr-CA', 'fr-FR', 'he-IL', 'hi-IN', 'hu-HU', 'id-ID', 'it-IT', 'ja-JP', 'ko-KR', 'nb-NO', 'nl-BE',
    //   'nl-NL', 'pl-PL', 'pt-BR', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'sv-SE', 'th-TH', 'tr-TR', 'zh-CN', 'zh-HK', 'zh-TW'];
    this.voiceLanguage = [
      {value: 'ar-SA', text: 'ar'},
      {value: 'cs-CZ', text: 'cs'},
      {value: 'da-DK', text: 'danmark'},
      {value: 'de-DE', text: 'german - DE'},
      {value: 'el-GR', text: 'gr'},
      {value: 'en', text: 'english'},
      {value: 'en-AU', text: 'english - AU'},
      {value: 'en-GB', text: 'english - GB'},
      {value: 'en-IE', text: 'english - IE'},
      {value: 'en-IN', text: 'english - IN'},
      {value: 'en-US', text: 'english - US'},
      {value: 'en-ZA', text: 'english - ZA'},
      {value: 'es-AR', text: 'spanish - AR'},
      {value: 'es-ES', text: 'spanish - ES'},
      {value: 'es-MX', text: 'spanish - MX'},
      {value: 'es-US', text: 'spanish - US'},
      {value: 'fi-FI', text: 'fi'},
      {value: 'fr-CA', text: 'french - CA'},
      {value: 'fr-FR', text: 'french - FR'},
      {value: 'he-IL', text: 'hr'},
      {value: 'hi-IN', text: 'hi'},
      {value: 'hu-HU', text: 'hu'},
      {value: 'id-ID', text: 'id'},
      {value: 'it-IT', text: 'it'},
      {value: 'ja-JP', text: 'ja'},
      {value: 'ko-KR', text: 'ko'},
      {value: 'nb-NO', text: 'nb'},
      {value: 'nl-BE', text: 'dutch - BE'},
      {value: 'nl-NL', text: 'dutch - NL'},
      {value: 'pl-PL', text: 'polish - PL'},
      {value: 'pt-BR', text: 'pt - BR'},
      {value: 'pt-PT', text: 'pt - PT'},
      {value: 'ro-RO', text: 'ro - RO'},
      {value: 'ru-RU', text: 'ru - RU'},
      {value: 'sk-SK', text: 'sk - SK'},
      {value: 'sv-SE', text: 'sv - SE'},
      {value: 'th-TH', text: 'th - TH'},
      {value: 'tr-TR', text: 'tr - TR'},
      {value: 'zh-CN', text: 'zh - CN'},
      {value: 'zh-HK', text: 'zh - HK'},
      {value: 'zh-TW', text: 'zh - TW'}];

    this.curLanguage = 'ar-SA';
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
    this.start = true;
    this.startBtn = false;
  }

  langClick(lang: any): void {
    console.log(lang);
  }

  langChanges(e: any): void {
    console.log(e.target.value);
    this.curLanguage = e.target.value;
  }
}
