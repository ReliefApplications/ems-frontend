describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=userscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-users').should('exist');
  });
});
