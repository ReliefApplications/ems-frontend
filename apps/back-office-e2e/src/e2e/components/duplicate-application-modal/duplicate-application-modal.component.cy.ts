describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=duplicateapplicationmodalcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-duplicate-application-modal').should('exist');
  });
});
