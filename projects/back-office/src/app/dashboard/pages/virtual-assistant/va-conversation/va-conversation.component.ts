import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Message} from '../models/message.model';
import {User} from '../models/user.model';
import {Choices} from '../models/choices.model';

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

  public endConv: boolean;
  public endConvMsg: string;

  constructor() {
    this.currentText = '';

    this.iCurrentQuestion = 0;

    this.endConvMsg = 'restart';
    this.endConv = false;

    this.currentRecord = {};
  }

  ngOnInit(): void {
    // this.speechToTextService.endSpeechEvent.subscribe(
    //   (text) => {
    //     this.currentText = text;
    //   }
    // );
    // this.controllerService.botReplied.subscribe(
    //   () => {
    //     this.updateScrollViewPos();
    //   }
    // );

    // window.setTimeout(() => {
    //   console.log('this.form');
    //   console.log(this.form);
    //   this.sendQuestionMsg(this.form[0].name);
    //   }, 5000);
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.form !== undefined) {
      this.sendNextQuestion();
    }
  }

  msgUpdated(msg: any): void{
    if (typeof msg === 'string'){
      this.currentText = msg;
    }
  }

  sendReplyMsgText(msg: string): void {
    if (!this.endConv && msg !== ''){
      this.addMsg('',
        msg,
        'true',
        new User('Me', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'),
        Date.now(),
        []);

      // this.records.push(msg);
      // complete current record
      // -1 because the chat start with a message of the bot
      this.currentRecord[this.form[this.iCurrentQuestion - 1].name] = msg;

      // reset input text
      this.currentText = '';

      this.updateScrollViewPos();

      this.sendNextQuestion();
    }
    // else if (msg === this.endConvMsg){
    //   this.restartForm();
    // }
  }

  sendReplyMsgChoice(ch: Choices): void {
    if (!this.endConv && ch.text !== ''){
      this.addMsg('',
        ch.text,
        'true',
        new User('Me', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'),
        Date.now(),
        []);

      // this.records.push(msg);
      // complete current record
      // -1 because the chat start with a message of the bot
      this.currentRecord[this.form[this.iCurrentQuestion - 1].name] = ch.value;

      // reset input text
      this.currentText = '';

      this.updateScrollViewPos();

      this.sendNextQuestion();
    }
  }

  sendReplyMsgTextEnd(): void {
      if (this.endConvMsg !== '') {
        this.addMsg('',
          this.endConvMsg,
          'true',
          new User('Me', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'),
          Date.now(),
          []);
        // reset input text
        this.currentText = '';
        this.updateScrollViewPos();
        this.sendNextQuestion();
      }
  }

  sendNextQuestion(): void {
    console.log('this.iCurrentQuestion');
    console.log(this.iCurrentQuestion);
    if (this.iCurrentQuestion < this.form.length){
      console.log('BEF');
      const r = this.questionController();
      console.log('AFT');
      console.log('this.iCurrentQuestion++; 1');
      this.iCurrentQuestion++;
      this.updateScrollViewPos();
      if (!r){
        this.sendNextQuestion();
      }
    }
    else if (this.iCurrentQuestion === this.form.length) {
      this.endConv = true;
      // add this record
      this.records.push(this.currentRecord);
      console.log('FIN: records');
      console.log(this.records);

      const cTab = [];
      // cTab.push(new Choices(this.endConvMsg, this.endConvMsg + '?'));
      cTab.push({value: this.endConvMsg, text: this.endConvMsg + '?'}, {value: 'value', text: 'text'});
      console.log(cTab);

      this.addMsg('text',
        'Thank you for your time, bye!',
        'false',
        new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
        Date.now(),
        cTab);
      console.log('this.iCurrentQuestion++; 2');
      this.iCurrentQuestion++;
      this.updateScrollViewPos();
    }
  }

  questionController(): boolean {
    let r = true;
    console.log('*** questionController ***');
    console.log(this.form[this.iCurrentQuestion].type);
    console.log(this.form[this.iCurrentQuestion].choices);
    switch (this.form[this.iCurrentQuestion].type){
      case 'text' || 'expression':
        this.addMsg(this.form[this.iCurrentQuestion].type,
          this.form[this.iCurrentQuestion].title,
          'false',
          new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
          Date.now(),
          []);
        break;
      case 'radiogroup' || 'checkbox':
        this.addMsg(this.form[this.iCurrentQuestion].type,
          this.form[this.iCurrentQuestion].title,
          'false',
          new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
          Date.now(),
          this.form[this.iCurrentQuestion].choices);
        break;
      case 'expression':
        if (this.form[this.iCurrentQuestion].description){
          this.addMsg(this.form[this.iCurrentQuestion].type,
            this.form[this.iCurrentQuestion].description,
            'false',
            new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
            Date.now(),
            []);
        }
        r = false;
        break;
      default:
        console.log('default');
        r = false;
        // console.log('this.iCurrentQuestion++; 3');
        // this.iCurrentQuestion++;

        break;
    }
    return r;
  }

  addMsg(type: string,
         text: string,
         reply: string,
         user: User,
         date: number,
         choices: Choices[]): void {
    this.conv.push(new Message(type, text, reply, user, date, choices));
  }

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

  startSpeech(): void {
    // this.speechToTextService.start();
  }

  choiceClick(choice: Choices): void{
    if (choice.value === this.endConvMsg){
      this.restartForm();
    }
    else {
      this.sendReplyMsgChoice(choice);
    }
  }

  restartForm(): void {
    this.endConv = false;
    this.sendReplyMsgTextEnd();
    this.iCurrentQuestion = 0;
    this.currentRecord = {};
    window.setTimeout(() => {
      this.sendNextQuestion();
    }, 500);
  }

}
