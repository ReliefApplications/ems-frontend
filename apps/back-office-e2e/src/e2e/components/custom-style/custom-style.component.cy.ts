describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=customstylecomponent--primary'));
  it('should render the component', () => {
    cy.get('app-custom-style').should('exist');
  });
});
