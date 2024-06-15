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

describe('PatronAccount e2e test', () => {
  const patronAccountPageUrl = '/patron-account';
  const patronAccountPageUrlPattern = new RegExp('/patron-account(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const patronAccountSample = {};

  let patronAccount;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/patron-accounts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/patron-accounts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/patron-accounts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (patronAccount) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/patron-accounts/${patronAccount.cardNumber}`,
      }).then(() => {
        patronAccount = undefined;
      });
    }
  });

  it('PatronAccounts menu should load PatronAccounts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('patron-account');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PatronAccount').should('exist');
    cy.url().should('match', patronAccountPageUrlPattern);
  });

  describe('PatronAccount page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(patronAccountPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PatronAccount page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/patron-account/new$'));
        cy.getEntityCreateUpdateHeading('PatronAccount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', patronAccountPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/patron-accounts',
          body: patronAccountSample,
        }).then(({ body }) => {
          patronAccount = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/patron-accounts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/patron-accounts?page=0&size=20>; rel="last",<http://localhost/api/patron-accounts?page=0&size=20>; rel="first"',
              },
              body: [patronAccount],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(patronAccountPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PatronAccount page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('patronAccount');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', patronAccountPageUrlPattern);
      });

      it('edit button click should load edit PatronAccount page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PatronAccount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', patronAccountPageUrlPattern);
      });

      it('edit button click should load edit PatronAccount page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PatronAccount');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', patronAccountPageUrlPattern);
      });

      it('last delete button click should delete instance of PatronAccount', () => {
        cy.intercept('GET', '/api/patron-accounts/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('patronAccount').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', patronAccountPageUrlPattern);

        patronAccount = undefined;
      });
    });
  });

  describe('new PatronAccount page', () => {
    beforeEach(() => {
      cy.visit(`${patronAccountPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PatronAccount');
    });

    it('should create an instance of PatronAccount', () => {
      cy.get(`[data-cy="cardNumber"]`).type('66e0eace-f').should('have.value', '66e0eace-f');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        patronAccount = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', patronAccountPageUrlPattern);
    });
  });
});
