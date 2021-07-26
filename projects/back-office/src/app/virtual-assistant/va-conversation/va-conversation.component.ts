import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Message} from '../models/message.model';
import {User} from '../models/user.model';
import {Choices} from '../models/choices.model';
// @ts-ignore
import Speech from 'speak-tts';
import {ConversationFooterComponent} from './conversation-footer/conversation-footer.component';


@Component({
  selector: 'app-va-conversation',
  templateUrl: './va-conversation.component.html',
  styleUrls: ['./va-conversation.component.scss']
})
export class VaConversationComponent implements OnInit, OnChanges {

  // @ts-ignore
  @ViewChild('footerComponent') conversationFooterComponent: ConversationFooterComponent;
  @Input() form: any[] = [];
  @Input() td: {title: string, description: string};
  public records: any[] = [];
  public currentRecord: any;

  @Input() language: string;

  public currentText: string;
  @ViewChild(CdkVirtualScrollViewport) viewport: any;

  public conv: Message[] = [];
  public iCurrentQuestion: number;

  public restartChoiceMsg: string;
  public endChoiceMsg: string;

  public endMessage: string;

  @Output() endConversation: EventEmitter<any> = new EventEmitter();

  public speech: any;
  public speechData: any;

  public userMe: User;
  public userVa: User;

  public inputMsgType: string;

  public mtObjectTemp: any;
  public iCurMtQ: number;

  constructor() {
    this.currentText = '';

    this.iCurrentQuestion = -1;

    this.restartChoiceMsg = 'restart';
    this.endChoiceMsg = 'end';

    this.currentRecord = {};

    this.userMe = new User('Me', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png');
    this.userVa = new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png');

    this.endMessage = 'Thank you for your time, do you want to start another session or end now?';

    this.inputMsgType = 'text';

    this.mtObjectTemp = {};
    this.iCurMtQ = -1;

    this.speech = new Speech();

    this.td = {title: '', description: ''};

    this.language = 'en-GB';
  }

  ngOnInit(): void {
    this.speakInit(this.speech, this.speechData);
    console.log('this.form');
    console.log(this.form);
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.form !== undefined) {
      // this.sendNextQuestion();
    }
  }

  msgUpdated(msg: any): void{
    if (typeof msg === 'string'){
      console.log('msgUpdated');
      console.log(msg);
      this.currentText = msg;
    }
  }

  // send simple reply message (TEXT) (click on send msg or enter)
  sendReplyMsgText(): void {
    console.log(this.iCurrentQuestion);
    if (this.iCurrentQuestion < this.form.length){
      if (this.currentText !== '' && (this.form[this.iCurrentQuestion].type === 'text' || this.form[this.iCurrentQuestion].type === 'comment')){
        this.addMsg('', this.currentText, true, this.userMe, Date.now(), []);
        this.currentRecord[this.form[this.iCurrentQuestion].name] = this.currentText;
        this.afterReply();
      }
      else if (this.currentText !== '' && this.form[this.iCurrentQuestion].type === 'multipletext'){
        this.addMsg('', this.currentText, true, this.userMe, Date.now(), []);
        this.mtObjectTemp[this.form[this.iCurrentQuestion].items[this.iCurMtQ ].name] = this.currentText;
        this.currentText = '';
        this.updateScrollViewPos();
        this.sendNextMtQuestion();
      }
    }
  }

  // send reply message after clicking on a choice (RADIOGROUP)
  sendReplyMsgChoice(ch: Choices): void {
    if (ch.text !== ''){
      this.speak(this.speech, ch.text);
      this.addMsg('', ch.text, true, this.userMe, Date.now(), []);
      this.currentRecord[this.form[this.iCurrentQuestion].name] = ch.value;
      this.afterReply();
    }
  }

  // click on a checkbox choice
  choiceCheckBoxClick(e: any): void {
    if (e.state === true){
      this.speak(this.speech, e.choice.text);
    }
    else {
      this.speak(this.speech, e.choice.text + ' removed');
    }
  }

  // click on a validate button (CHECKBOX)
  choiceCheckBoxValidateClick(choices: any[]): void {
    let text = ''; const choicesRecord: string[] = [];

    choices.forEach((ch) => {
      choicesRecord.push(ch.value);
      text = text + ' ' + ch.text;
    });

    this.addMsg('', text, true, this.userMe, Date.now(), []);
    this.currentRecord[this.form[this.iCurrentQuestion].name] = choicesRecord;
    this.afterReply();
  }

  // send final conversation message
  sendReplyMsgTextEnd(): void {
    if (this.restartChoiceMsg !== '') {
      this.addMsg('', this.restartChoiceMsg, true, this.userMe, Date.now(), []);
      this.afterReply();
    }
  }

  afterReply(): void {
    this.currentText = '';
    this.updateScrollViewPos();
    this.sendNextQuestion();
  }

  restartForm(): void {
    this.sendReplyMsgTextEnd();
    this.iCurrentQuestion = -1;
    this.currentRecord = {};
    window.setTimeout(() => {
      this.sendNextQuestion();
    }, 500);
  }

  sendNextQuestion(): void {
    console.log('sendNextQuestion');
    console.log(this.currentText);
    if (this.conv.length === 0){
      if (this.td.title !== undefined){
        this.addMsg('text', this.td.title, false, this.userVa, Date.now(), []);
      }
      if (this.td.description !== undefined){
        this.addMsg('text', this.td.description, false, this.userVa, Date.now(), []);
      }
      this.sendNextQuestion();
    }
    else {
      this.iCurrentQuestion++;
      if (this.iCurrentQuestion < this.form.length){
        const r = this.questionController();
        this.updateScrollViewPos();
        if (!r){
          this.sendNextQuestion();
        }
      }
      else if (this.iCurrentQuestion === this.form.length) {
        // add this record
        this.records.push(this.currentRecord);
        console.log(this.records);

        this.addMsg('text', this.endMessage, false, this.userVa, Date.now(),
          [
            new Choices(this.restartChoiceMsg, this.restartChoiceMsg + '?'),
            new Choices(this.endChoiceMsg, this.endChoiceMsg + '?')
          ]);
        this.inputMsgType = 'text';
        this.updateScrollViewPos();
      }
    }
  }

  // control the bot format message depending on the type
  questionController(): boolean {
    this.inputMsgType = 'text';
    let r = true;
    const t = this.form[this.iCurrentQuestion].type;
    switch (t){
      case 'text':
        if (this.form[this.iCurrentQuestion].inputType !== null) {
          this.inputMsgType = this.form[this.iCurrentQuestion].inputType;
          console.log(this.inputMsgType);
          if (this.inputMsgType === 'color'){
            this.currentText = '#000000';
          }
          if (this.inputMsgType === 'range'){
            this.currentText = '50';
          }
        }
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, false,
          this.userVa, Date.now(), []);
        break;
      case 'comment':
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, false,
          this.userVa, Date.now(), []);
        break;
      case 'boolean':
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, false,
          this.userVa, Date.now(), [new Choices(false, this.form[this.iCurrentQuestion].labelFalse),
            new Choices(true, this.form[this.iCurrentQuestion].labelTrue)]);
        break;
      case 'radiogroup':
      case 'dropdown':
      case 'checkbox':
      case 'tagbox':
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, false,
          this.userVa, Date.now(), this.form[this.iCurrentQuestion].choices);
        break;
      case 'expression':
        if (this.form[this.iCurrentQuestion].description){
          this.addMsg(this.form[this.iCurrentQuestion].type,
            this.form[this.iCurrentQuestion].title + '\n' + this.form[this.iCurrentQuestion].description,
            false,
            this.userVa, Date.now(), []);
        }
        r = false;
        break;
      case 'multipletext':
        this.iCurMtQ = -1;
        this.mtObjectTemp = {};
        this.sendNextMtQuestion();
        break;
      default:
        this.currentRecord[this.form[this.iCurrentQuestion].name] = null,
        r = false;
        break;
    }
    return r;
  }

  sendNextMtQuestion(): void {
    this.iCurMtQ ++ ;
    if (this.iCurMtQ < this.form[this.iCurrentQuestion].items.length){
      this.addMsg('text', this.form[this.iCurrentQuestion].items[this.iCurMtQ].title, false, this.userVa, Date.now(), []);
    }
    else {
      this.currentRecord[this.form[this.iCurrentQuestion].name] = this.mtObjectTemp;
      this.sendNextQuestion();
    }
  }

  // click on a choice (radio)
  choiceClick(choice: Choices): void{
    if (choice.value === this.restartChoiceMsg){
      this.restartForm();
    }
    else if (choice.value === this.endChoiceMsg){
      this.endConversation.emit(this.records);
    }
    else {
      this.sendReplyMsgChoice(choice);
    }
  }

  // add a message to the conversation
  addMsg(type: string,
         text: string,
         reply: boolean,
         user: User,
         date: number,
         choices: Choices[]): void {
    if (!reply){
      console.log('speak');
      this.speak(this.speech, text);
    }
    this.conv.push(new Message(type, text, reply, user, date, choices));
    this.conversationFooterComponent.inputFocus();
  }

  /* ----- STYLE ----- */

  updateScrollViewPos(): void {
    setTimeout(() => {
      this.viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 0);
    setTimeout(() => {
      this.viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 50);
  }

  /* ----- TTS ----- */

  speakInit(speech: Speech, speechData: any): void {
    if (speech.hasBrowserSupport()) {
      console.log('speech synthesis supported');
      speech.init({
        volume: 1,
        lang: this.language,
        rate: 1,
        pitch: 1,
        splitSentences: true,
        listeners: {
        }
      }).then((data: any) => {
        console.log('Speech is ready, voices are available', data);
        speechData = data;
        this.sendNextQuestion();

      }).catch((e: any) => {
        console.error('An error occured while initializing : ', e);
      });
    }
  }

  speak(speech: Speech, msg: string): void {
    speech.speak({
      text: msg,
    }).then(() => {
      console.log('Success !');
    }).catch((e: any) => {
      console.error('An error occurred :', e);
    });
  }
}
