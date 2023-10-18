describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=previewtoolbarcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-preview-toolbar').should('exist');
  });
});
