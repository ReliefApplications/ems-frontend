describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=addpagecomponent--primary'));
  it('should render the component', () => {
    cy.get('app-add-page').should('exist');
  });
});
