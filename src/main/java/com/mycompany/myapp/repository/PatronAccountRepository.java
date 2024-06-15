package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PatronAccount;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the PatronAccount entity.
 */
@Repository
public interface PatronAccountRepository extends JpaRepository<PatronAccount, String> {
    default Optional<PatronAccount> findOneWithEagerRelationships(String cardNumber) {
        return this.findOneWithToOneRelationships(cardNumber);
    }

    default List<PatronAccount> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<PatronAccount> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct patronAccount from PatronAccount patronAccount left join fetch patronAccount.user",
        countQuery = "select count(distinct patronAccount) from PatronAccount patronAccount"
    )
    Page<PatronAccount> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct patronAccount from PatronAccount patronAccount left join fetch patronAccount.user")
    List<PatronAccount> findAllWithToOneRelationships();

    @Query("select patronAccount from PatronAccount patronAccount left join fetch patronAccount.user where patronAccount.id =:id")
    Optional<PatronAccount> findOneWithToOneRelationships(@Param("id") String id);
}
