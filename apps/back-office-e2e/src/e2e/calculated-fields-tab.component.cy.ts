describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=calculatedfieldstabcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-calculated-fields-tab').should('exist');
  });
});
