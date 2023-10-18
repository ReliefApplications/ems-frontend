describe('back-office', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=referencedatascomponent--primary')
  );
  it('should render the component', () => {
    cy.get('app-reference-datas').should('exist');
  });
});
