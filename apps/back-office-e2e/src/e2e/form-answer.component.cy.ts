describe('back-office', () => {
  beforeEach(() => cy.visit('/iframe.html?id=formanswercomponent--primary'));
  it('should render the component', () => {
    cy.get('app-form-answer').should('exist');
  });
});
