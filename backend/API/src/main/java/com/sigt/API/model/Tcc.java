package com.sigt.API.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Tcc {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String studentName;
    private String studentId;
    private String advisorName;
    private String title;
    private String summary;
    private String modality;
    private String status;
    private String scheduledDate;
}
