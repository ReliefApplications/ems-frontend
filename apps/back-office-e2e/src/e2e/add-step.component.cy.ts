describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=addstepcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-add-step').should('exist');
  });
});
