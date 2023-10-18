describe('front-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=sharecomponent--primary'));
  it('should render the component', () => {
    cy.get('app-share').should('exist');
  });
});
