describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=shareurlcomponent--primary'));
  it('should render the component', () => {
    cy.get('app-share-url').should('exist');
  });
});
