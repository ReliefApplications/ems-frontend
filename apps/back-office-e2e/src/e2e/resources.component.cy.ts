describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=resourcescomponent--primary'));
  it('should render the component', () => {
    cy.get('app-resources').should('exist');
  });
});
