describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=apiconfigurationcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-api-configuration').should('exist');
  });
});
