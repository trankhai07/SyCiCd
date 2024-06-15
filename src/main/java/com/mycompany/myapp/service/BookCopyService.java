package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.BookCopy;
import com.mycompany.myapp.repository.BookCopyRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link BookCopy}.
 */
@Service
@Transactional
public class BookCopyService {

    private final Logger log = LoggerFactory.getLogger(BookCopyService.class);

    private final BookCopyRepository bookCopyRepository;

    public BookCopyService(BookCopyRepository bookCopyRepository) {
        this.bookCopyRepository = bookCopyRepository;
    }

    /**
     * Save a bookCopy.
     *
     * @param bookCopy the entity to save.
     * @return the persisted entity.
     */
    public BookCopy save(BookCopy bookCopy) {
        log.debug("Request to save BookCopy : {}", bookCopy);
        return bookCopyRepository.save(bookCopy);
    }

    /**
     * Update a bookCopy.
     *
     * @param bookCopy the entity to save.
     * @return the persisted entity.
     */
    public BookCopy update(BookCopy bookCopy) {
        log.debug("Request to update BookCopy : {}", bookCopy);
        return bookCopyRepository.save(bookCopy);
    }

    /**
     * Partially update a bookCopy.
     *
     * @param bookCopy the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<BookCopy> partialUpdate(BookCopy bookCopy) {
        log.debug("Request to partially update BookCopy : {}", bookCopy);

        return bookCopyRepository
            .findById(bookCopy.getId())
            .map(existingBookCopy -> {
                if (bookCopy.getYearPublished() != null) {
                    existingBookCopy.setYearPublished(bookCopy.getYearPublished());
                }
                if (bookCopy.getAmount() != null) {
                    existingBookCopy.setAmount(bookCopy.getAmount());
                }
                if (bookCopy.getImage() != null) {
                    existingBookCopy.setImage(bookCopy.getImage());
                }
                if (bookCopy.getDescription() != null) {
                    existingBookCopy.setDescription(bookCopy.getDescription());
                }

                return existingBookCopy;
            })
            .map(bookCopyRepository::save);
    }

    /**
     * Get all the bookCopies.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<BookCopy> findAll(Pageable pageable) {
        log.debug("Request to get all BookCopies");
        return bookCopyRepository.findAll(pageable);
    }

    /**
     * Get all the bookCopies with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<BookCopy> findAllWithEagerRelationships(Pageable pageable) {
        return bookCopyRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one bookCopy by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<BookCopy> findOne(Long id) {
        log.debug("Request to get BookCopy : {}", id);
        return bookCopyRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the bookCopy by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete BookCopy : {}", id);
        bookCopyRepository.deleteById(id);
    }
}
