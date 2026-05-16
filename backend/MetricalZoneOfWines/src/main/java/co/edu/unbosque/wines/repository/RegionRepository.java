package co.edu.unbosque.wines.repository;

import co.edu.unbosque.wines.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RegionRepository extends JpaRepository<Region, Integer> {
    List<Region> findByCountryId(Integer countryId);
}