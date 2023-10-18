describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=updaterecordcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-update-record').should('exist');
  });
});
