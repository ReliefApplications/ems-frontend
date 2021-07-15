import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Message} from '../models/message.model';
import {User} from '../models/user.model';
import {Choices} from '../models/choices.model';
// @ts-ignore
import Speech from 'speak-tts';

@Component({
  selector: 'app-va-conversation',
  templateUrl: './va-conversation.component.html',
  styleUrls: ['./va-conversation.component.scss']
})
export class VaConversationComponent implements OnInit, OnChanges {

  @Input() form: any[] = [];
  public records: any[] = [];
  public currentRecord: any;

  public currentText: string;
  @ViewChild(CdkVirtualScrollViewport) viewport: any;

  public conv: Message[] = [];
  public iCurrentQuestion: number;

  public restartChoiceMsg: string;
  public endChoiceMsg: string;

  public userImgLink: string;
  public vaImgLink: string;

  public endMessage: string;

  @Output() endConversation: EventEmitter<any> = new EventEmitter();

  public speech: any;
  public speechData: any;

  public userMe: User;
  public userVa: User;

  public inputMsgType: string;

  constructor() {
    this.currentText = '';

    this.iCurrentQuestion = -1;

    this.restartChoiceMsg = 'restart';
    this.endChoiceMsg = 'end';

    this.currentRecord = {};

    this.userImgLink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png';
    this.vaImgLink = 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png';

    this.userMe = new User('Me', this.userImgLink);
    this.userVa = new User('Assistant', this.vaImgLink);

    this.endMessage = 'Thank you for your time, bye!';

    this.speech = new Speech();

    this.inputMsgType = 'text';
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
      this.currentText = msg;
    }
  }

  // send simple reply message (TEXT) (click on send msg or enter)
  sendReplyMsgText(msg: string): void {
    console.log(this.iCurrentQuestion);
    console.log(this.form[this.iCurrentQuestion - 1].type);
    console.log(this.form[this.iCurrentQuestion].type);
    if (this.iCurrentQuestion < this.form.length){
      if (msg !== '' && (this.form[this.iCurrentQuestion].type === 'text' || this.form[this.iCurrentQuestion].type === 'comment')){
        this.addMsg('', msg, 'true', this.userMe, Date.now(), []);

        // this.records.push(msg);
        // complete current record
        // -1 because the chat start with a message of the bot
        this.currentRecord[this.form[this.iCurrentQuestion].name] = msg;
        this.afterReply();
      }
    }
  }

  // send reply message after clicking on a choice (RADIOGROUP)
  sendReplyMsgChoice(ch: Choices): void {
    if (ch.text !== ''){

      this.speak(this.speech, ch.text);

      this.addMsg('', ch.text, 'true', this.userMe, Date.now(), []);
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

    this.addMsg('', text, 'true', this.userMe, Date.now(), []);
    this.currentRecord[this.form[this.iCurrentQuestion].name] = choicesRecord;
    this.afterReply();
  }

  // send final conversation message
  sendReplyMsgTextEnd(): void {
    if (this.restartChoiceMsg !== '') {
      this.addMsg('', this.restartChoiceMsg, 'true', this.userMe, Date.now(), []);
      this.afterReply();
    }
  }

  afterReply(): void {
    // reset input text
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

      this.addMsg('text', this.endMessage, 'false', this.userVa, Date.now(),
        [
          new Choices(this.restartChoiceMsg, this.restartChoiceMsg + '?'),
          new Choices(this.endChoiceMsg, this.endChoiceMsg + '?')
        ]);

      // this.iCurrentQuestion++;
      this.updateScrollViewPos();
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
        }
        // else {
        //   this.inputMsgType = 'text';
        // }
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, 'false',
          this.userVa, Date.now(), []);
        break;
      case 'comment':
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, 'false',
          this.userVa, Date.now(), []);
        break;
      case 'radiogroup':
      case 'dropdown':
      case 'checkbox':
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, 'false',
          this.userVa, Date.now(), this.form[this.iCurrentQuestion].choices);
        break;
      case 'expression':
        if (this.form[this.iCurrentQuestion].description){
          this.addMsg(this.form[this.iCurrentQuestion].type,
            this.form[this.iCurrentQuestion].title + '\n' + this.form[this.iCurrentQuestion].description,
            'false',
            this.userVa, Date.now(), []);
        }
        r = false;
        break;
      // case 'comment':
      //   this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].description, 'false',
      //     this.userVa, Date.now(), []);
      default:
        this.currentRecord[this.form[this.iCurrentQuestion].name] = null,
        r = false;
        break;
    }
    return r;
  }

  // click on a choice (radio)
  choiceClick(choice: Choices): void{
    if (choice.value === this.restartChoiceMsg){
      this.restartForm();
    }
    else if (choice.value === this.endChoiceMsg){
      this.endConversation.emit(this.records);
      // add record
      // close the window
      // window.close();
    }
    else {
      this.sendReplyMsgChoice(choice);
    }
  }

  // add a message to the conversation
  addMsg(type: string,
         text: string,
         reply: string,
         user: User,
         date: number,
         choices: Choices[]): void {
    if (reply === 'false'){
      console.log('speak');
      this.speak(this.speech, text);
    }
    this.conv.push(new Message(type, text, reply, user, date, choices));
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
    if (speech.hasBrowserSupport()) { // returns a boolean
      console.log('speech synthesis supported');
      speech.init({
        volume: 1,
        lang: 'en-GB',
        rate: 1,
        pitch: 1,
        voice: 'Google UK English Male',
        splitSentences: true,
        listeners: {
        }
      }).then((data: any) => {
        // The "data" object contains the list of available voices and the voice synthesis params
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
