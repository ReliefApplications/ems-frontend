describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=settingscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-settings').should('exist');
  });
});
