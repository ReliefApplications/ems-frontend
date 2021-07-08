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
      console.log(this.conv);

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
    if (this.iCurrentQuestion < this.form.length){
      this.questionController();
      this.iCurrentQuestion++;
      this.updateScrollViewPos();
    }
    else if (this.iCurrentQuestion === this.form.length) {
      this.endConv = true;
      // add this record
      this.records.push(this.currentRecord);
      console.log(this.records);

      this.addMsg('',
        'Thank you for your time, bye!',
        'false',
        new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
        Date.now(),
        [new Choices(this.endConvMsg, this.endConvMsg + '?')]);
      this.iCurrentQuestion++;
      this.updateScrollViewPos();
    }
  }

  questionController(): void {
    switch (this.form[this.iCurrentQuestion].type){
      case 'text':
        this.addMsg('',
          this.form[this.iCurrentQuestion].title,
          'false',
          new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
          Date.now(),
          []);
        break;
      case 'radiogroup':
        this.addMsg('',
          this.form[this.iCurrentQuestion].title,
          'false',
          new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
          Date.now(),
          []);
        break;
    }
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

  choiceClick(choice: any): void{
    console.log(choice);
    if (choice === this.endConvMsg){
      this.restartForm();
    }
    else {
      this.sendReplyMsgText(choice);
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
