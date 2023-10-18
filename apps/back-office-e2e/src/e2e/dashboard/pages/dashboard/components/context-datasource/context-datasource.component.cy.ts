describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=contextdatasourcecomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-context-datasource').should('exist');
  });
});
