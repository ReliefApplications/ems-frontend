describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=editbuttonactioncomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-edit-button-action').should('exist');
  });
});
