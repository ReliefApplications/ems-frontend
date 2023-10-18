describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=addresourcemodalcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-add-resource-modal').should('exist');
  });
});
