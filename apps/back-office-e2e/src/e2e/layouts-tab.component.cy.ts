describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=layoutstabcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-layouts-tab').should('exist');
  });
});
