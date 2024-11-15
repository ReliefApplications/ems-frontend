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
  htmlValue =
    '<p>This is <strong>HTML</strong> content with <a href="#">links</a>.</p>';
}

export default {
  title: 'Pipes/Strip HTML',
  component: StripHtmlPipeDemoComponent,
} as Meta<StripHtmlPipeDemoComponent>;

type Story = StoryObj<StripHtmlPipeDemoComponent>;

/** Default story */
export const Default: Story = {};

export const MultiLineText: Story = {
  args: {
    htmlValue: `<div>
  <h1>Welcome to <em>Angular</em>!</h1>
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
