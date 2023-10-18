describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=subscriptionscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-subscriptions').should('exist');
  });
});
