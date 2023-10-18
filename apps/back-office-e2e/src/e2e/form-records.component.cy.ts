describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=formrecordscomponent--primary'));
  it('should render the component', () => {
    cy.get('app-form-records').should('exist');
  });
});
