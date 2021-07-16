import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-conversation-footer',
  templateUrl: './conversation-footer.component.html',
  styleUrls: ['./conversation-footer.component.scss']
})

export class ConversationFooterComponent implements OnInit, OnChanges {

  @Output() btnSendClick: EventEmitter<any> = new EventEmitter();
  @Output() btnRecClick: EventEmitter<any> = new EventEmitter();

  @Output() inputChange: EventEmitter<any> = new EventEmitter();

  public input: any;
  public btnSend: any;
  public btnRec: any;

  @Input() inputValue = '';
  @Input() inputType = '';

  ngOnChanges(changes: SimpleChanges): void {
    // we skip that at the beginning when object are not yet set
    if (this.input !== undefined && changes.inputValue !== undefined){
      // if (this.inputType === 'color'){
      //   this.inputValue = '#000000';
      // }
      // if (this.inputType === 'range'){
      //   this.inputValue = '50';
      // }
      // if (this.inputType === 'tel'){
      //   console.log('### TEL ###');
      //   this.inputValue = '+';
      // }
      console.log('changes.inputValue.currentValue : ' + changes.inputValue.currentValue);
      console.log('this.inputValue : ' + this.inputValue);
      console.log('this.inputType : ' + this.inputType);
      console.log('this.input.value : ' + this.input.value);
      this.input.value = this.inputValue;
      this.msgChange(changes.inputValue.currentValue);
      this.input.focus();
    }
  }

  constructor() {
  }

  ngOnInit(): void {
    this.input = document.getElementById('inputMsg');
    this.btnSend = document.getElementById('btnSend');
    this.btnRec = document.getElementById('btnRec');
  }

  msgChange(text: string): void {
    this.inputChange.emit(text);
    if (text === ''){
      this.btnSend.setAttribute('disabled', '');
      this.btnSend.setAttribute('style', 'display: none');

      this.btnRec.removeAttribute('disabled');
      this.btnRec.setAttribute('style', 'display: inline');
    } else {
      this.btnRec.setAttribute('disabled', '');
      this.btnRec.setAttribute('style', 'display: none');

      this.btnSend.removeAttribute('disabled');
      this.btnSend.setAttribute('style', 'display: inline');
    }
  }
}
