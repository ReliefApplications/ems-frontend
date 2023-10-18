describe('front-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=formcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-form').should('exist');
  });
});
