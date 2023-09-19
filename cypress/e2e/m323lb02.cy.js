describe('Quiz App E2E Tests', () => {

  // a.
  it('Quizkarte erstellen', () => {
      cy.visit('http://localhost:9001');
  // Neue Karte erstellen
      cy.get('input[placeholder="Frage eingeben"]').type('Was ist 1101?');
      cy.get('input[placeholder="Antwort eingeben"]').type('13.');
      cy.get('button').contains('✅').click();
  });

  it('Quizkarten bearbeiten', () => {
    cy.visit('http://localhost:9001');
    cy.get('input[placeholder="Frage eingeben"]').type('Was ist 1101?');
    cy.get('input[placeholder="Antwort eingeben"]').type('13.');
    cy.get('button').contains('✅').click();
    
    // Karte bearbeiten
    cy.get('button').contains('✏️').click();
    cy.get('input[placeholder="Frage eingeben"]').type('Was ist 0010?');
    cy.get('input[placeholder="Antwort eingeben"]').type('2.');
    cy.get('button').contains('✅').click();
 
  });

  it('Quizkarte löschen', () => {
    cy.visit('http://localhost:9001');
    cy.get('input[placeholder="Frage eingeben"]').type('Was ist 1101?');
    cy.get('input[placeholder="Antwort eingeben"]').type('13.');
    cy.get('button').contains('✅').click();    
    cy.get('button').contains('❌').click();
  
});

  it('Lösung der Quizkarte anzeigen', () => {
    cy.visit('http://localhost:9001');
    cy.get('input[placeholder="Frage eingeben"]').type('Was ist 1101?');
    cy.get('input[placeholder="Antwort eingeben"]').type('13.');
    cy.get('button').contains('✅').click();
    cy.wait(2000);    
    cy.get('button').contains('Antwort anzeigen').click();
  });

});