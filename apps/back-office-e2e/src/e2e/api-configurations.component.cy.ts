describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=apiconfigurationscomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-api-configurations').should('exist');
  });
});
