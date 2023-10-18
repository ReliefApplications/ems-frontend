describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=positionmodalcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-position-modal').should('exist');
  });
});
