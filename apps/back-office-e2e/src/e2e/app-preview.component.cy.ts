describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=apppreviewcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-app-preview').should('exist');
  });
});
