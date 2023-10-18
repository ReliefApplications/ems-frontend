describe('front-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=rolesummarycomponent--primary'));
  it('should render the component', () => {
    cy.get('app-role-summary').should('exist');
  });
});
