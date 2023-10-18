describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=referencedatacomponent--primary'));
  it('should render the component', () => {
    cy.get('app-reference-data').should('exist');
  });
});
