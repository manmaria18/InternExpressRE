package ro.ubb.mp.controller.dto.response.announcement;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import ro.ubb.mp.controller.dto.response.InterestAreaResponseDTO;
import ro.ubb.mp.dao.model.InternshipType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

//dto pt cum afiseaza anuntul be->fe
@Data
@Builder
public class AnnouncementResponseDTO {
    private Long id;

    private AnnouncementUserResponseDTO user;
    private String title;

    private Date postingDate;
    private String description;
    private String duration;
    @JsonFormat(pattern = "yyyy-MM-dd [.HH]:[.mm]:[.ss][.SSS][.SS][.S]")
    private LocalDateTime startDate;
    private String detailLink;
    private String domain;
    @NonNull
    private InternshipType type;
}
