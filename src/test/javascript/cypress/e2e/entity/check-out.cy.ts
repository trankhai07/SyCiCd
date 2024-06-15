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

describe('CheckOut e2e test', () => {
  const checkOutPageUrl = '/check-out';
  const checkOutPageUrlPattern = new RegExp('/check-out(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const checkOutSample = {};

  let checkOut;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/check-outs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/check-outs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/check-outs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (checkOut) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/check-outs/${checkOut.id}`,
      }).then(() => {
        checkOut = undefined;
      });
    }
  });

  it('CheckOuts menu should load CheckOuts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('check-out');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CheckOut').should('exist');
    cy.url().should('match', checkOutPageUrlPattern);
  });

  describe('CheckOut page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(checkOutPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CheckOut page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/check-out/new$'));
        cy.getEntityCreateUpdateHeading('CheckOut');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', checkOutPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/check-outs',
          body: checkOutSample,
        }).then(({ body }) => {
          checkOut = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/check-outs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/check-outs?page=0&size=20>; rel="last",<http://localhost/api/check-outs?page=0&size=20>; rel="first"',
              },
              body: [checkOut],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(checkOutPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CheckOut page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('checkOut');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', checkOutPageUrlPattern);
      });

      it('edit button click should load edit CheckOut page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CheckOut');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', checkOutPageUrlPattern);
      });

      it('edit button click should load edit CheckOut page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CheckOut');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', checkOutPageUrlPattern);
      });

      it('last delete button click should delete instance of CheckOut', () => {
        cy.intercept('GET', '/api/check-outs/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('checkOut').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', checkOutPageUrlPattern);

        checkOut = undefined;
      });
    });
  });

  describe('new CheckOut page', () => {
    beforeEach(() => {
      cy.visit(`${checkOutPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CheckOut');
    });

    it('should create an instance of CheckOut', () => {
      cy.get(`[data-cy="startTime"]`).type('2024-06-15T12:43').blur().should('have.value', '2024-06-15T12:43');

      cy.get(`[data-cy="endTime"]`).type('2024-06-15T15:25').blur().should('have.value', '2024-06-15T15:25');

      cy.get(`[data-cy="status"]`).select('Refused');

      cy.get(`[data-cy="isReturned"]`).should('not.be.checked');
      cy.get(`[data-cy="isReturned"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        checkOut = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', checkOutPageUrlPattern);
    });
  });
});
