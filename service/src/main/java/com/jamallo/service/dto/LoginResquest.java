package com.jamallo.service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResquest {

    @NotBlank
    private String email;

    @NotBlank
    private String contrasenia;
}