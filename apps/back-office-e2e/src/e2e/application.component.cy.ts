describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=applicationcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-application').should('exist');
  });
});
