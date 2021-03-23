import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'who-tab-filter',
  templateUrl: './tab-filter.component.html',
  styleUrls: ['./tab-filter.component.scss']
})
export class WhoTabFilterComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() filters: any[];

  private inputs = '';
  private isDateValid = true;
  constructor(private elemRef: ElementRef) { }

  ngOnInit(): void {
  }

  setCurrentDate(filterName): void {
    this.form.controls[filterName].setValue('$today');
  }

  onKey(e, filterName): void {
    if (e.target.value === '') this.inputs = '';
    if (e.keyCode === 8) {
      this.inputs = this.inputs.slice(0, this.inputs.length -1);
    }
    if (this.inputs.length <= 9) {
      if (RegExp('^[0-9]*$').test(e.key)) {
        if (this.inputs.length === 3 || this.inputs.length === 6) {
          this.inputs += e.key + '/';
          e.target.value += '/';
        } else {
          this.inputs += e.key;
        }
      } else if (e.key === '/') {
        e.stopPropagation();
        this.inputs = this.inputs.slice(0, this.inputs.length -1);
      } else {
        e.stopPropagation();
        e.target.value = e.target.value.replace(/[^0-9\/]/g, '');
      }
    } else {
      e.stopPropagation();
      e.target.value = this.inputs
    }
    if (this.inputs.length > 9 && !RegExp('\\d{4}\\/(0?[1-9]|1[012])\\/(0?[1-9]|[12][0-9]|3[01])*').test(this.inputs)) {
      this.isDateValid = false;
      this.form.controls[filterName].setErrors({'incorrect': true})
    }
  }
}