describe('Bee Simple Critical Flows', () => {
    it('loads the homepage for a normal user', () => {
        cy.visit('/');
        cy.contains('Bee Simple');
        cy.contains('Client-Side Data');
        // Ensure Client-Side data loads
        cy.contains('Loading amazing content...').should('exist');
        cy.wait(2000); // Wait for fake delay
        cy.contains('Loading amazing content...').should('not.exist');
        cy.get('.card-grid').should('exist');
    });

    it('SSR test route works', () => {
        // This route simulates what a bot sees
        cy.request('/test-ssr').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.contain('Bee Simple');
            // Bots should receive rendered HTML, not just the empty root
            expect(response.body).to.contain('<div id="root">');
        });
    });
});
