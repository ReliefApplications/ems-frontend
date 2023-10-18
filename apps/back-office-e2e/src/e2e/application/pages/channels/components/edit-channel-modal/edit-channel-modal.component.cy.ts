describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=editchannelmodalcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-edit-channel-modal').should('exist');
  });
});
