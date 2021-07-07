import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Message} from '../models/message.model';
import {User} from '../models/user.model';

@Component({
  selector: 'app-va-conversation',
  templateUrl: './va-conversation.component.html',
  styleUrls: ['./va-conversation.component.scss']
})
export class VaConversationComponent implements OnInit {

  @Input() form: any[] = [];
  public records: any[] = [];

  public currentText: string;
  @ViewChild(CdkVirtualScrollViewport) viewport: any;

  public messages: Message[] = [];
  public iCurrentQuestion: number;

  constructor() {
    this.currentText = '';
    console.log(this.messages);
    this.iCurrentQuestion = 0;
    // this.viewport = new CdkVirtualScrollViewport();
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

  ngOnChanges(): void{
    console.log('ngAfterContentInit');
    if (this.form !== undefined) {
      console.log('*this.form*');
      console.log(this.form);
      this.sendQuestionMsg();
    }
  }

  msgUpdated(msg: any): void{
    if (typeof msg === 'string'){
      this.currentText = msg;
    }
  }

  sendReplyMsg(msg: string): void {
    this.currentText = msg;
    if (this.currentText !== '') {
      this.addMsg('',
        this.currentText,
        'true',
        new User('Me', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png'),
        Date.now(),
        []);
      console.log(this.messages);
    }
    this.currentText = '';
    this.updateScrollViewPos();

    this.sendQuestionMsg();
  }

  sendQuestionMsg(): void {
    if (this.iCurrentQuestion < this.form.length){
      console.log('sendQuestionMsg');
      console.log(this.iCurrentQuestion);
      console.log(this.form.length);
      this.currentText = this.form[this.iCurrentQuestion].name;
    }
    else {
      this.currentText = 'Form finished';
    }
    if (this.currentText !== '') {
      this.addMsg('',
        this.currentText,
        'false',
        new User('Assistant', 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png'),
        Date.now(),
        []);
      console.log(this.messages);
      this.iCurrentQuestion++;
    }
    this.currentText = '';
    this.updateScrollViewPos();
  }

  addMsg(type: string,
         text: string,
         reply: string,
         user: User,
         date: number,
         choices: string[]): void {
    this.messages.push(new Message(type, text, reply, user, date, choices));
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

  choiceClick(e: any): void{
    console.log(e);
    this.sendReplyMsg(e);
  }

}
