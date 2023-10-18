describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=positionattributescomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-position').should('exist');
  });
});
