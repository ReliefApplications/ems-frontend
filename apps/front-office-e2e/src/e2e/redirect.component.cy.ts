describe('front-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=redirectcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-redirect').should('exist');
  });
});
