describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=recordstabcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-records-tab').should('exist');
  });
});
