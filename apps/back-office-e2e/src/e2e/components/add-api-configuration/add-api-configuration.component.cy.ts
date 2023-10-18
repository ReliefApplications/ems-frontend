describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=addapiconfigurationcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-add-api-configuration').should('exist');
  });
});
