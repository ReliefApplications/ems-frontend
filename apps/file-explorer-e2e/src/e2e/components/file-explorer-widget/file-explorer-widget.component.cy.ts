describe('file-explorer', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=fileexplorerwidgetcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('oort-front-file-explorer-widget').should('exist');
  });
});
