describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=resourcecomponent--primary'));
  it('should render the component', () => {
    cy.get('app-resource').should('exist');
  });
});
