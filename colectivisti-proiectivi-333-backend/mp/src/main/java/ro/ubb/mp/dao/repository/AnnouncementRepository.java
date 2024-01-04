package ro.ubb.mp.dao.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.ubb.mp.dao.model.Announcement;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findAllByTypeContainingIgnoreCase(String type);

    List<Announcement> findAllByOrderByPostingDateDesc();

}
