import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Message} from '../models/message.model';
import {User} from '../models/user.model';

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
      this.sendQuestionMsg();
    }
  }

  msgUpdated(msg: any): void{
    if (typeof msg === 'string'){
      this.currentText = msg;
    }
  }

  sendReplyMsg(msg: string): void {
    if (!this.endConv){
      if (msg !== '') {
        this.addMsg('',
          msg,
          'true',
          new User('Me', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'),
          Date.now(),
          []);
        console.log(this.conv);

        // this.records.push(msg);
        // complete current record
        // -1 because the chat start with a message of the bot
        this.currentRecord[this.form[this.iCurrentQuestion - 1].name] = msg;
        console.log(this.currentRecord);
        console.log(this.iCurrentQuestion);

        console.log(this.records);

        // reset input text
        this.currentText = '';

        this.updateScrollViewPos();

        this.sendQuestionMsg();
      }
    }
  }

  sendReplyMsgEnd(): void {
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
        this.sendQuestionMsg();
      }
  }

  sendQuestionMsg(): void {
    let nextQuest = '';
    if (this.iCurrentQuestion < this.form.length){
      nextQuest = this.form[this.iCurrentQuestion].title;
      this.addMsg('',
        nextQuest,
        'false',
        new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
        Date.now(),
        []);
    }
    else if (this.iCurrentQuestion === this.form.length) {
      nextQuest = 'Thank you for your time, bye!';
      this.endConv = true;
      // add this record
      this.records.push(this.currentRecord);

      this.addMsg('',
        nextQuest,
        'false',
        new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
        Date.now(),
        [this.endConvMsg]);
    }
    if (this.iCurrentQuestion <= this.form.length){
      this.iCurrentQuestion++;
      this.updateScrollViewPos();
    }
  }

  addMsg(type: string,
         text: string,
         reply: string,
         user: User,
         date: number,
         choices: string[]): void {
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

  choiceClick(choice: any): void{
    console.log(choice);
    if (choice === this.endConvMsg){
      this.endConv = false;
      this.sendReplyMsgEnd();
      this.iCurrentQuestion = 0;
      this.currentRecord = {};
      window.setTimeout(() => {
        this.sendQuestionMsg();
      }, 500);
    }
    else {
      this.sendReplyMsg(choice);
    }

  }

}
