package com.jamallo.service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Pattern(
            regexp = "^(?=.*[a-z])" + //al menos una minúscula
                    "(?=.*[A-Z])" + //al menos una mayúscula
                    "(?=.*\\d)" + //al menos un número
                    ".{6,}$", //mínimo 6 caracteres
            message = "La contraseña debe tener al menos 6 dígitos, una mayúscula, una minúscula y un número por lo menos"
    )
    private String contrasenia;
}