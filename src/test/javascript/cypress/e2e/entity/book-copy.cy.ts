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

describe('BookCopy e2e test', () => {
  const bookCopyPageUrl = '/book-copy';
  const bookCopyPageUrlPattern = new RegExp('/book-copy(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const bookCopySample = {};

  let bookCopy;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/book-copies+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/book-copies').as('postEntityRequest');
    cy.intercept('DELETE', '/api/book-copies/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (bookCopy) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/book-copies/${bookCopy.id}`,
      }).then(() => {
        bookCopy = undefined;
      });
    }
  });

  it('BookCopies menu should load BookCopies page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('book-copy');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BookCopy').should('exist');
    cy.url().should('match', bookCopyPageUrlPattern);
  });

  describe('BookCopy page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bookCopyPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create BookCopy page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/book-copy/new$'));
        cy.getEntityCreateUpdateHeading('BookCopy');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCopyPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/book-copies',
          body: bookCopySample,
        }).then(({ body }) => {
          bookCopy = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/book-copies+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/book-copies?page=0&size=20>; rel="last",<http://localhost/api/book-copies?page=0&size=20>; rel="first"',
              },
              body: [bookCopy],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(bookCopyPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details BookCopy page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('bookCopy');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCopyPageUrlPattern);
      });

      it('edit button click should load edit BookCopy page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookCopy');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCopyPageUrlPattern);
      });

      it('edit button click should load edit BookCopy page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookCopy');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCopyPageUrlPattern);
      });

      it('last delete button click should delete instance of BookCopy', () => {
        cy.intercept('GET', '/api/book-copies/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('bookCopy').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCopyPageUrlPattern);

        bookCopy = undefined;
      });
    });
  });

  describe('new BookCopy page', () => {
    beforeEach(() => {
      cy.visit(`${bookCopyPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('BookCopy');
    });

    it('should create an instance of BookCopy', () => {
      cy.get(`[data-cy="yearPublished"]`).type('25934').should('have.value', '25934');

      cy.get(`[data-cy="amount"]`).type('84385').should('have.value', '84385');

      cy.get(`[data-cy="image"]`).type('syndicate').should('have.value', 'syndicate');

      cy.get(`[data-cy="description"]`).type('Mexico SSL').should('have.value', 'Mexico SSL');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        bookCopy = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', bookCopyPageUrlPattern);
    });
  });
});
