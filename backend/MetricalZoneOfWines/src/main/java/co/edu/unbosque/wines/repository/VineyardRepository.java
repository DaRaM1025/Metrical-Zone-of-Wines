package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.Vineyard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VineyardRepository extends JpaRepository<Vineyard, Integer> {
    List<Vineyard> findByRegionId(Integer regionId);
}