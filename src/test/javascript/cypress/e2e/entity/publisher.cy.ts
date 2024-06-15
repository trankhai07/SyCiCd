import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Publisher e2e test', () => {
  const publisherPageUrl = '/publisher';
  const publisherPageUrlPattern = new RegExp('/publisher(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const publisherSample = { name: 'empower Multi-layered Dynamic' };

  let publisher;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/publishers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/publishers').as('postEntityRequest');
    cy.intercept('DELETE', '/api/publishers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (publisher) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/publishers/${publisher.id}`,
      }).then(() => {
        publisher = undefined;
      });
    }
  });

  it('Publishers menu should load Publishers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('publisher');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Publisher').should('exist');
    cy.url().should('match', publisherPageUrlPattern);
  });

  describe('Publisher page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(publisherPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Publisher page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/publisher/new$'));
        cy.getEntityCreateUpdateHeading('Publisher');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', publisherPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/publishers',
          body: publisherSample,
        }).then(({ body }) => {
          publisher = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/publishers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/publishers?page=0&size=20>; rel="last",<http://localhost/api/publishers?page=0&size=20>; rel="first"',
              },
              body: [publisher],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(publisherPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Publisher page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('publisher');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', publisherPageUrlPattern);
      });

      it('edit button click should load edit Publisher page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Publisher');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', publisherPageUrlPattern);
      });

      it('edit button click should load edit Publisher page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Publisher');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', publisherPageUrlPattern);
      });

      it('last delete button click should delete instance of Publisher', () => {
        cy.intercept('GET', '/api/publishers/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('publisher').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', publisherPageUrlPattern);

        publisher = undefined;
      });
    });
  });

  describe('new Publisher page', () => {
    beforeEach(() => {
      cy.visit(`${publisherPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Publisher');
    });

    it('should create an instance of Publisher', () => {
      cy.get(`[data-cy="name"]`).type('synergy withdrawal Nevada').should('have.value', 'synergy withdrawal Nevada');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        publisher = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', publisherPageUrlPattern);
    });
  });
});
