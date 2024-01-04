package ro.ubb.mp.controller.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;
import ro.ubb.mp.dao.model.InternshipType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
//fe->be (pt creare)
@Data
@Builder
public class AnnouncementRequestDTO {

    private Long userId;
    private String title;
    private String description;
    private String duration;
    @JsonFormat(pattern = "yyyy-MM-dd [.HH]:[.mm]:[.ss][.SSS][.SS][.S]")
    private LocalDateTime startDate;
    private String detailLink;
    private String domain;
    @NonNull
    private InternshipType type;
}

