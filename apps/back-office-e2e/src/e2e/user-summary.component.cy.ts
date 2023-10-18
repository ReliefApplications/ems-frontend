describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=usersummarycomponent--primary'));
  it('should render the component', () => {
    cy.get('app-user-summary').should('exist');
  });
});
