package ro.ubb.mp.dao.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "announcements")

public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    private String title;
    private LocalDateTime postingDate;
    private String duration;
    private String domain;
    private LocalDateTime startDate;
    private String description;
    private String detailLink;

    @Enumerated(EnumType.STRING)
    private InternshipType type;
}
