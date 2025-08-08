package com.cybercrime.dto;

import lombok.Data;
import java.util.List;

@Data
public class DepartmentUpdateDto {
    private String name;
    private String description;
    private boolean active;
    private List<Long> departmentAdminIds;
}
