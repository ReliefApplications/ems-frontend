describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=formstabcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-forms-tab').should('exist');
  });
});
