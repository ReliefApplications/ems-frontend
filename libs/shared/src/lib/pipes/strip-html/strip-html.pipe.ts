import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sharedStripHtml',
  standalone: true,
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    // Create a temporary DOM element to leverage the browser's parsing
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    return tempElement.innerText; // Return the plain text
  }
}
