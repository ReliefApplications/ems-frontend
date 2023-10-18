describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=channelscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-channels').should('exist');
  });
});
