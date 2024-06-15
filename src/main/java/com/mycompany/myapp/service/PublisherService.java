package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Publisher;
import com.mycompany.myapp.repository.PublisherRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Publisher}.
 */
@Service
@Transactional
public class PublisherService {

    private final Logger log = LoggerFactory.getLogger(PublisherService.class);

    private final PublisherRepository publisherRepository;

    public PublisherService(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    /**
     * Save a publisher.
     *
     * @param publisher the entity to save.
     * @return the persisted entity.
     */
    public Publisher save(Publisher publisher) {
        log.debug("Request to save Publisher : {}", publisher);
        return publisherRepository.save(publisher);
    }

    /**
     * Update a publisher.
     *
     * @param publisher the entity to save.
     * @return the persisted entity.
     */
    public Publisher update(Publisher publisher) {
        log.debug("Request to update Publisher : {}", publisher);
        return publisherRepository.save(publisher);
    }

    /**
     * Partially update a publisher.
     *
     * @param publisher the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Publisher> partialUpdate(Publisher publisher) {
        log.debug("Request to partially update Publisher : {}", publisher);

        return publisherRepository
            .findById(publisher.getId())
            .map(existingPublisher -> {
                if (publisher.getName() != null) {
                    existingPublisher.setName(publisher.getName());
                }

                return existingPublisher;
            })
            .map(publisherRepository::save);
    }

    /**
     * Get all the publishers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Publisher> findAll(Pageable pageable) {
        log.debug("Request to get all Publishers");
        return publisherRepository.findAll(pageable);
    }

    /**
     * Get one publisher by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Publisher> findOne(Long id) {
        log.debug("Request to get Publisher : {}", id);
        return publisherRepository.findById(id);
    }

    /**
     * Delete the publisher by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Publisher : {}", id);
        publisherRepository.deleteById(id);
    }
}
