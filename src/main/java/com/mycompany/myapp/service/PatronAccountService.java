package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.PatronAccount;
import com.mycompany.myapp.repository.PatronAccountRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link PatronAccount}.
 */
@Service
@Transactional
public class PatronAccountService {

    private final Logger log = LoggerFactory.getLogger(PatronAccountService.class);

    private final PatronAccountRepository patronAccountRepository;

    public PatronAccountService(PatronAccountRepository patronAccountRepository) {
        this.patronAccountRepository = patronAccountRepository;
    }

    /**
     * Save a patronAccount.
     *
     * @param patronAccount the entity to save.
     * @return the persisted entity.
     */
    public PatronAccount save(PatronAccount patronAccount) {
        log.debug("Request to save PatronAccount : {}", patronAccount);
        return patronAccountRepository.save(patronAccount);
    }

    /**
     * Update a patronAccount.
     *
     * @param patronAccount the entity to save.
     * @return the persisted entity.
     */
    public PatronAccount update(PatronAccount patronAccount) {
        log.debug("Request to update PatronAccount : {}", patronAccount);
        patronAccount.setIsPersisted();
        return patronAccountRepository.save(patronAccount);
    }

    /**
     * Partially update a patronAccount.
     *
     * @param patronAccount the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PatronAccount> partialUpdate(PatronAccount patronAccount) {
        log.debug("Request to partially update PatronAccount : {}", patronAccount);

        return patronAccountRepository
            .findById(patronAccount.getCardNumber())
            .map(existingPatronAccount -> {
                return existingPatronAccount;
            })
            .map(patronAccountRepository::save);
    }

    /**
     * Get all the patronAccounts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PatronAccount> findAll(Pageable pageable) {
        log.debug("Request to get all PatronAccounts");
        return patronAccountRepository.findAll(pageable);
    }

    /**
     * Get all the patronAccounts with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<PatronAccount> findAllWithEagerRelationships(Pageable pageable) {
        return patronAccountRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one patronAccount by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PatronAccount> findOne(String id) {
        log.debug("Request to get PatronAccount : {}", id);
        return patronAccountRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the patronAccount by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete PatronAccount : {}", id);
        patronAccountRepository.deleteById(id);
    }
}
