package com.daniil.library.dto;

import java.time.LocalDate;

public class LoanDTO {

    private String title;
    private LocalDate start;
    private LocalDate end;
    private String status;

    public LoanDTO(String title, LocalDate start, LocalDate end, String status) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.status = status;
    }

    public LocalDate getStart() {
        return start;
    }

    public void setStart(LocalDate start) {
        this.start = start;
    }

    public LocalDate getEnd() {
        return end;
    }

    public void setEnd(LocalDate end) {
        this.end = end;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
