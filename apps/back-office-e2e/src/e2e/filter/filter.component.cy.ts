describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=filtercomponent--primary&args=loading:false;')
  );
  it('should render the component', () => {
    cy.get('app-filter').should('exist');
  });
});
