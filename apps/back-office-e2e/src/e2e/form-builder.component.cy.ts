describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=formbuildercomponent--primary'));
  it('should render the component', () => {
    cy.get('app-form-builder').should('exist');
  });
});
