package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.CheckOut;
import com.mycompany.myapp.repository.CheckOutRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link CheckOut}.
 */
@Service
@Transactional
public class CheckOutService {

    private final Logger log = LoggerFactory.getLogger(CheckOutService.class);

    private final CheckOutRepository checkOutRepository;

    public CheckOutService(CheckOutRepository checkOutRepository) {
        this.checkOutRepository = checkOutRepository;
    }

    /**
     * Save a checkOut.
     *
     * @param checkOut the entity to save.
     * @return the persisted entity.
     */
    public CheckOut save(CheckOut checkOut) {
        log.debug("Request to save CheckOut : {}", checkOut);
        return checkOutRepository.save(checkOut);
    }

    /**
     * Update a checkOut.
     *
     * @param checkOut the entity to save.
     * @return the persisted entity.
     */
    public CheckOut update(CheckOut checkOut) {
        log.debug("Request to update CheckOut : {}", checkOut);
        return checkOutRepository.save(checkOut);
    }

    /**
     * Partially update a checkOut.
     *
     * @param checkOut the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CheckOut> partialUpdate(CheckOut checkOut) {
        log.debug("Request to partially update CheckOut : {}", checkOut);

        return checkOutRepository
            .findById(checkOut.getId())
            .map(existingCheckOut -> {
                if (checkOut.getStartTime() != null) {
                    existingCheckOut.setStartTime(checkOut.getStartTime());
                }
                if (checkOut.getEndTime() != null) {
                    existingCheckOut.setEndTime(checkOut.getEndTime());
                }
                if (checkOut.getStatus() != null) {
                    existingCheckOut.setStatus(checkOut.getStatus());
                }
                if (checkOut.getIsReturned() != null) {
                    existingCheckOut.setIsReturned(checkOut.getIsReturned());
                }

                return existingCheckOut;
            })
            .map(checkOutRepository::save);
    }

    /**
     * Get all the checkOuts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CheckOut> findAll(Pageable pageable) {
        log.debug("Request to get all CheckOuts");
        return checkOutRepository.findAll(pageable);
    }

    /**
     * Get one checkOut by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CheckOut> findOne(Long id) {
        log.debug("Request to get CheckOut : {}", id);
        return checkOutRepository.findById(id);
    }

    /**
     * Delete the checkOut by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete CheckOut : {}", id);
        checkOutRepository.deleteById(id);
    }
}
