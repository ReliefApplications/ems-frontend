describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=choserolecomponent--primary'));
  it('should render the component', () => {
    cy.get('app-chose-role').should('exist');
  });
});
