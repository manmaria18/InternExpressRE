package ro.ubb.mp.service.announcement;

import lombok.Data;
import lombok.Getter;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ro.ubb.mp.controller.dto.request.AnnouncementRequestDTO;
import ro.ubb.mp.dao.model.Announcement;
import ro.ubb.mp.dao.model.InterestArea;
import ro.ubb.mp.dao.model.User;
import ro.ubb.mp.dao.repository.AnnouncementRepository;
import ro.ubb.mp.service.interestArea.InterestAreaService;
import ro.ubb.mp.service.user.UserService;

import javax.persistence.EntityNotFoundException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Data
@Getter
@Service
public class AnnouncementServiceImpl implements AnnouncementService {
    private final AnnouncementRepository announcementRepository;
    private final UserService userService;
    private final InterestAreaService interestAreaService;


    @Override
    public Optional<Announcement> findById(Long id) {
        return announcementRepository.findById(id);
    }

    @Override
    public List<Announcement> getAll() {
        return announcementRepository.findAll();
    }

    @Override
    public List<Announcement> getAnnouncementsOrderedByDate() {
        return announcementRepository.findAllByOrderByPostingDateDesc();
    }

    @Override
    public Announcement saveAnnouncement(AnnouncementRequestDTO announcementDTO) {
        final User user = getUserService().getUserById(announcementDTO.getUserId()).
                orElseThrow(EntityNotFoundException::new);


        final Announcement announcementToBeSaved = Announcement.builder()
                .description(announcementDTO.getDescription())
                .title(announcementDTO.getTitle())
                .postingDate(Timestamp.from(Instant.now()).toLocalDateTime())
                .user(user)
                .detailLink(announcementDTO.getDetailLink())
                .duration(announcementDTO.getDuration())
                .domain(announcementDTO.getDomain())
                .startDate(announcementDTO.getStartDate())
                .type(announcementDTO.getType())
                .build();
        return announcementRepository.save(announcementToBeSaved);

    }

    @Override
    public Announcement updateAnnouncement(AnnouncementRequestDTO announcementRequestDTO, Long id) {
        Announcement announcement = findById(id).orElseThrow(EntityNotFoundException::new);


        announcement.setDescription(announcementRequestDTO.getDescription());
        announcement.setTitle(announcementRequestDTO.getTitle());
        announcement.setDuration(announcementRequestDTO.getDuration());
        announcement.setDetailLink(announcementRequestDTO.getDetailLink());
        announcement.setType(announcementRequestDTO.getType());
        announcement.setDomain(announcementRequestDTO.getDomain());
        announcement.setStartDate(announcementRequestDTO.getStartDate());


        return announcementRepository.save(announcement);

    }

    @Override
    public void deleteAnnouncementById(Long id) {
        announcementRepository.deleteById(id);

    }

    @Override
    public List<Announcement> getAnnouncementFilteredByInternshipType(String queryString) {
        if (!StringUtils.hasText(queryString)) {
            return announcementRepository.findAll();
        }
        return announcementRepository.findAllByTypeContainingIgnoreCase(queryString);
    }

}
