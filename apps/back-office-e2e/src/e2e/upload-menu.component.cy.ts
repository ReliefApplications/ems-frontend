describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=uploadmenucomponent--primary'));
  it('should render the component', () => {
    cy.get('app-upload-menu').should('exist');
  });
});
