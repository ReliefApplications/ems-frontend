describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=addreferencedatacomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-add-reference-data').should('exist');
  });
});
