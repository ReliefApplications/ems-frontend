describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=addchannelmodalcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-add-channel-modal').should('exist');
  });
});
