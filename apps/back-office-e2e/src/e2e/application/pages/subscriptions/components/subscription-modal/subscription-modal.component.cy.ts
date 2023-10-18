describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=subscriptionmodalcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-subscription-modal').should('exist');
  });
});
