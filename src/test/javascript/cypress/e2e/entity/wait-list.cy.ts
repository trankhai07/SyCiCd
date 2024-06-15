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

describe('WaitList e2e test', () => {
  const waitListPageUrl = '/wait-list';
  const waitListPageUrlPattern = new RegExp('/wait-list(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const waitListSample = {};

  let waitList;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/wait-lists+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/wait-lists').as('postEntityRequest');
    cy.intercept('DELETE', '/api/wait-lists/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (waitList) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/wait-lists/${waitList.id}`,
      }).then(() => {
        waitList = undefined;
      });
    }
  });

  it('WaitLists menu should load WaitLists page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('wait-list');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('WaitList').should('exist');
    cy.url().should('match', waitListPageUrlPattern);
  });

  describe('WaitList page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(waitListPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create WaitList page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/wait-list/new$'));
        cy.getEntityCreateUpdateHeading('WaitList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', waitListPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/wait-lists',
          body: waitListSample,
        }).then(({ body }) => {
          waitList = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/wait-lists+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/wait-lists?page=0&size=20>; rel="last",<http://localhost/api/wait-lists?page=0&size=20>; rel="first"',
              },
              body: [waitList],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(waitListPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details WaitList page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('waitList');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', waitListPageUrlPattern);
      });

      it('edit button click should load edit WaitList page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('WaitList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', waitListPageUrlPattern);
      });

      it('edit button click should load edit WaitList page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('WaitList');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', waitListPageUrlPattern);
      });

      it('last delete button click should delete instance of WaitList', () => {
        cy.intercept('GET', '/api/wait-lists/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('waitList').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', waitListPageUrlPattern);

        waitList = undefined;
      });
    });
  });

  describe('new WaitList page', () => {
    beforeEach(() => {
      cy.visit(`${waitListPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('WaitList');
    });

    it('should create an instance of WaitList', () => {
      cy.get(`[data-cy="creatAt"]`).type('2024-06-15T19:30').blur().should('have.value', '2024-06-15T19:30');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        waitList = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', waitListPageUrlPattern);
    });
  });
});
