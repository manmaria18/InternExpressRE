package ro.ubb.mp.dao.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.ubb.mp.dao.model.Announcement;
import ro.ubb.mp.dao.model.InternshipType;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findAllByType(InternshipType type);

    List<Announcement> findAllByOrderByPostingDateDesc();

}
