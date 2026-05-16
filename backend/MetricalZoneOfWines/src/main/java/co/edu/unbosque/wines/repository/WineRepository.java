package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.Wine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WineRepository extends JpaRepository<Wine, Integer> {
    List<Wine> findByVineyardId(Integer vineyardId);
}