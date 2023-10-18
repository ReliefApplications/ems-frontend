describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=addformmodalcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-add-form-modal').should('exist');
  });
});
