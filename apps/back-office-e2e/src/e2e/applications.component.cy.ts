describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=applicationscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-applications').should('exist');
  });
});
