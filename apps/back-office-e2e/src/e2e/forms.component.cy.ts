describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=formscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-forms').should('exist');
  });
});
