describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=editpulljobmodalcomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-edit-pull-job-modal').should('exist');
  });
});
