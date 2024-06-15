package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.WaitList;
import com.mycompany.myapp.repository.WaitListRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link WaitList}.
 */
@Service
@Transactional
public class WaitListService {

    private final Logger log = LoggerFactory.getLogger(WaitListService.class);

    private final WaitListRepository waitListRepository;

    public WaitListService(WaitListRepository waitListRepository) {
        this.waitListRepository = waitListRepository;
    }

    /**
     * Save a waitList.
     *
     * @param waitList the entity to save.
     * @return the persisted entity.
     */
    public WaitList save(WaitList waitList) {
        log.debug("Request to save WaitList : {}", waitList);
        return waitListRepository.save(waitList);
    }

    /**
     * Update a waitList.
     *
     * @param waitList the entity to save.
     * @return the persisted entity.
     */
    public WaitList update(WaitList waitList) {
        log.debug("Request to update WaitList : {}", waitList);
        return waitListRepository.save(waitList);
    }

    /**
     * Partially update a waitList.
     *
     * @param waitList the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<WaitList> partialUpdate(WaitList waitList) {
        log.debug("Request to partially update WaitList : {}", waitList);

        return waitListRepository
            .findById(waitList.getId())
            .map(existingWaitList -> {
                if (waitList.getCreatAt() != null) {
                    existingWaitList.setCreatAt(waitList.getCreatAt());
                }

                return existingWaitList;
            })
            .map(waitListRepository::save);
    }

    /**
     * Get all the waitLists.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<WaitList> findAll(Pageable pageable) {
        log.debug("Request to get all WaitLists");
        return waitListRepository.findAll(pageable);
    }

    /**
     * Get all the waitLists with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<WaitList> findAllWithEagerRelationships(Pageable pageable) {
        return waitListRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one waitList by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WaitList> findOne(Long id) {
        log.debug("Request to get WaitList : {}", id);
        return waitListRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the waitList by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete WaitList : {}", id);
        waitListRepository.deleteById(id);
    }
}
