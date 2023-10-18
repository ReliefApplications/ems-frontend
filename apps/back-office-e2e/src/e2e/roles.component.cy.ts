describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=rolescomponent--primary'));
  it('should render the component', () => {
    cy.get('app-roles').should('exist');
  });
});
