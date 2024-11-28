/**
 * Html with context
 *
 * Results removes all \n as they'll be added from tailwind
 */
export const contextFormatElement = {
  before: `
<p>{{context.id}}</p>
<p>{{context.status}}</p>
<p>{{context.title}}</p>
<p>{{context.description}}</p>
<p>{{context.check_box}}</p>
<p>{{context.createdAt}}</p>
<p>{{context.modifiedAt}}</p>
 `,
  after: `
<p>66fa9502760ab688bf8508e9s</p>
<p>Published</p>
<p>I can't believe this is a title</p>
<p>Super duper dubi dat gua trikili dup description</p>
<p>true</p>
<p>2024-09-28T12:21:21.498Z</p>
<p>2024-09-30T12:21:21.498Z</p>
 `,
};
/** Context data */
export const optionsContext = {
  __typename: 'TestsMockData',
  id: '66fa9502760ab688bf8508e9s',
  status: 'Published',
  title: "I can't believe this is a title",
  description: 'Super duper dubi dat gua trikili dup description',
  check_box: true,
  modifiedAt: '2024-09-30T12:21:21.498Z',
  createdAt: '2024-09-28T12:21:21.498Z',
};
