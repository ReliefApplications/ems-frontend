describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=pulljobscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-pull-jobs').should('exist');
  });
});
