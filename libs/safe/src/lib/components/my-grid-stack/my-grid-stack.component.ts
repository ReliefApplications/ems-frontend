import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
} from '@angular/core';
import { GridStack } from 'gridstack';

/**
 * Component definition for grid widgets
 */
@Component({
  selector: 'safe-grid-stack',
  templateUrl: './my-grid-stack.component.html',
  styleUrls: ['./my-grid-stack.component.scss'],
})
export class SafeGridStackComponent implements AfterContentInit, AfterViewInit {
  constructor(private el: ElementRef) {}
  private content!: any[];

  options = {
    disableOneColumnMode: false,
    float: true,
    removable: false,
    disableDrag: false,
    disableResize: false,
    resizable: { autoHide: true, handles: 'all' },
  };

  ngAfterContentInit() {
    // const content = this.el.nativeElement.getElementById('content');
    console.log(this.el);
    // console.log(content);
    this.content = this.el.nativeElement.querySelectorAll('.safe-grid-item');
    console.log(this.content);
  }

  ngAfterViewInit(): void {
    const grid = GridStack.init(this.options);
    console.log('well initialized');
    // for (const cont of this.content) {
    //   grid.addWidget(
    //     '<div class="grid-stack-item"><div class="grid-stack-item-content">' +
    //       '<div class="p-2">Bonjour</div>' +
    //       '</div></div>'
    //   );
    // }
    const id = 'ContainerWidget' + grid.getGridItems().length;

    const childId = grid.getGridItems().length;

    grid.addWidget(
      '<div class="grid-stack-item" id="' +
        childId +
        '"><div class="grid-stack-item-content"><div class="p-2"><div class="container"  id = "' +
        id +
        '"><button id="graph' +
        id +
        '">Add Graph</button></div></div></div></div>',
      { w: 3 }
    );

    // grid.addWidget(
    //   '<div class="grid-stack-item"><div class="grid-stack-item-content">' +
    //     '<div class="p-2">Bonjour1</div>' +
    //     '</div></div>'
    // );
    // grid.addWidget(
    //   '<div class="grid-stack-item"><div class="grid-stack-item-content">' +
    //     '<div class="p-2">Bonjour2</div>' +
    //     '</div></div>'
    // );
  }
}
