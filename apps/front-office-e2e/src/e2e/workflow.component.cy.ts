describe('front-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=workflowcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-workflow').should('exist');
  });
});
