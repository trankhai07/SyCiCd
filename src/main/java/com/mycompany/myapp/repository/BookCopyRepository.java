package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.BookCopy;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the BookCopy entity.
 */
@Repository
public interface BookCopyRepository extends JpaRepository<BookCopy, Long> {
    default Optional<BookCopy> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<BookCopy> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<BookCopy> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct bookCopy from BookCopy bookCopy left join fetch bookCopy.book left join fetch bookCopy.publisher",
        countQuery = "select count(distinct bookCopy) from BookCopy bookCopy"
    )
    Page<BookCopy> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct bookCopy from BookCopy bookCopy left join fetch bookCopy.book left join fetch bookCopy.publisher")
    List<BookCopy> findAllWithToOneRelationships();

    @Query("select bookCopy from BookCopy bookCopy left join fetch bookCopy.book left join fetch bookCopy.publisher where bookCopy.id =:id")
    Optional<BookCopy> findOneWithToOneRelationships(@Param("id") Long id);
}
