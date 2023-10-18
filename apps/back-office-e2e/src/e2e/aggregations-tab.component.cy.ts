describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=aggregationstabcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-aggregations-tab').should('exist');
  });
});
