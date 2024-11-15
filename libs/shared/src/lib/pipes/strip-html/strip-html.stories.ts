import { Component } from '@angular/core';
import { StripHtmlPipe } from './strip-html.pipe';
import { Meta, StoryObj } from '@storybook/angular';
import { SanitizeHtmlPipe } from '../sanitize-html/sanitize-html.pipe';

/**
 * Test component.
 */
@Component({
  selector: 'strip-html-pipe-demo',
  template: `
    <div class="flex flex-col gap-8">
      <div>
        <h3>Input HTML:</h3>
        <div>{{ htmlValue }}</div>
      </div>
      <div>
        <h3>Display HTML:</h3>
        <div [innerHTML]="htmlValue | sharedSanitizeHtml"></div>
      </div>

      <div>
        <h3>Output Text:</h3>
        <div [innerHTML]="htmlValue | sharedStripHtml"></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [StripHtmlPipe, SanitizeHtmlPipe],
})
class StripHtmlPipeDemoComponent {
  /** Html value to pass to pipe */
  htmlValue = '';
}

export default {
  title: 'Pipes/Strip HTML',
  component: StripHtmlPipeDemoComponent,
} as Meta<StripHtmlPipeDemoComponent>;

type Story = StoryObj<StripHtmlPipeDemoComponent>;

/** Default story */
export const Default: Story = {
  args: {
    htmlValue:
      '<p>This is <strong>HTML</strong> content with <a href="#">links</a>.</p>',
  },
};

/** Multi line html story */
export const MultiLineText: Story = {
  args: {
    htmlValue: `<div>
  <strong>Welcome to <em>Angular</em>!</strong>
  <p>This is a <strong>sample</strong> HTML content.</p>
  <ul>
    <li>Feature 1: <a href="#">Dynamic</a></li>
    <li>Feature 2: <span style="color: red;">Reactive</span></li>
    <li>Feature 3: Easy to use</li>
  </ul>
  <footer>
    <p>Created by <a href="https://example.com">Your Company</a>.</p>
  </footer>
</div>`,
  },
};

/** Complex html story */
export const ComplexHTML: Story = {
  args: {
    htmlValue: `
    <div>
    <h2>Product Details</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Product</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img src="https://via.placeholder.com/100" alt="Sample Product" />
          </td>
          <td>A high-quality product that meets your needs.</td>
          <td>$25.00</td>
        </tr>
        <tr>
          <td>
            <img src="https://via.placeholder.com/100" alt="Another Product" />
          </td>
          <td>Another amazing product to enhance your experience.</td>
          <td>$40.00</td>
        </tr>
      </tbody>
    </table>
    <p>For more details, visit our <a href="https://example.com">website</a>.</p>
  </div>
    `,
  },
};

export const allInlineTags: Story = {
  args: {
    htmlValue: `
    <h1 style="color: darkblue; background-color: lightgray; font-weight: bold;">
    Example of Inline HTML Tags
  </h1>
  <p style="color: #333; background-color: #f0f8ff; font-weight: normal;">
    <strong style="color: crimson;">Bold text</strong>, 
    <em style="color: teal; font-weight: bold;">italic text</em>, 
    and <b style="color: indigo;">visually bold</b> 
    with <i style="color: darkorange;">visually italic</i>.
  </p>
  <p style="color: purple; background-color: lavender; font-weight: normal;">
    Links are created with the <code>&lt;a&gt;</code> tag:
    <a href="https://example.com" style="color: royalblue; text-decoration: underline;">Visit Example</a>.
  </p>
  <p style="color: darkgreen; background-color: honeydew; font-weight: lighter;">
    Images are inline too:
    <img src="https://via.placeholder.com/50" alt="Placeholder Image" style="border: 2px solid maroon;">
  </p>
  <p style="color: sienna; background-color: mistyrose; font-weight: bold;">
    Superscripts and subscripts are useful for math and chemistry:
    H<sub style="color: darkslateblue;">2</sub>O or x<sup style="color: darkred;">2</sup>.
  </p>
  <p style="color: black; background-color: lightyellow; font-weight: normal;">
    Inline code snippets use the <code>&lt;code&gt;</code> tag:
    <code style="color: darkcyan; background-color: #eee;">const example = true;</code>.
  </p>
  <p style="color: firebrick; background-color: papayawhip; font-weight: normal;">
    Keyboard inputs use <code>&lt;kbd&gt;</code>: Press 
    <kbd style="background-color: lightgray; border: 1px solid black;">Ctrl</kbd> + 
    <kbd style="background-color: lightgray; border: 1px solid black;">S</kbd>.
  </p>
  <p style="color: goldenrod; background-color: #fff8dc; font-weight: bold;">
    Text can be highlighted with the <mark style="background-color: yellow;">highlight</mark> tag.
  </p>
  <p style="color: coral; background-color: #ffefd5; font-weight: normal;">
    Abbreviations are marked with the <abbr> tag: 
    <abbr title="Hypertext Markup Language" style="text-decoration: dotted; color: darkblue;">HTML</abbr>.
  </p>
  <p style="color: navy; background-color: aliceblue; font-weight: bold;">
    Citations use <cite style="font-style: italic; color: olive;">Shakespeare's Hamlet</cite>.
  </p>
  <p style="color: deeppink; background-color: lavenderblush; font-weight: normal;">
    Bidirectional isolation with <bdi style="color: mediumvioletred;">مرحبا</bdi> works well with mixed content.
  </p>
  <p style="color: black; background-color: lightblue; font-weight: normal;">
    Bi-directional override with <bdo dir="rtl" style="color: crimson;">This text is reversed!</bdo>.
  </p>
  <p style="color: seagreen; background-color: #f5f5f5; font-weight: lighter;">
    Line breaks are done with <code>&lt;br&gt;</code>: Line 1<br>Line 2<br>Line 3.
  </p>
  <p style="color: brown; background-color: peachpuff; font-weight: bold;">
    Variable names can use <var style="font-style: italic; color: maroon;">x</var> + 
    <var style="font-style: italic; color: maroon;">y</var>.
  </p>
  <p style="color: darkslategray; background-color: whitesmoke; font-weight: bold;">
    Quoted text with <q style="color: darkgoldenrod;">The quick brown fox jumps over the lazy dog.</q>
  </p>
  <p style="color: slateblue; background-color: oldlace; font-weight: normal;">
    Time can be formatted with <time style="color: teal;">November 15, 2024</time>.
  </p>
  <p style="color: gray; background-color: #f9f9f9; font-weight: lighter;">
    Small text with <small style="color: darkred;">Disclaimer: This is just an example.</small>
  </p>
  <p style="color: tomato; background-color: #fff0f5; font-weight: normal;">
    Deleted text with <del style="color: darkgray;">Old price: $50</del>. 
    Inserted text with <ins style="color: green;">New price: $40</ins>.
  </p>
  <p style="color: steelblue; background-color: #f0ffff; font-weight: normal;">
    Inline spans for custom styling: <span style="background-color: lightpink; color: purple;">Highlighted text</span>.
  </p>
    `,
  },
};
