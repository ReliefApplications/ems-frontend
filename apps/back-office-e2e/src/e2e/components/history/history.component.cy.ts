describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=historycomponent--primary&args=dataSource;')
  );
  it('should render the component', () => {
    cy.get('app-history').should('exist');
  });
});
