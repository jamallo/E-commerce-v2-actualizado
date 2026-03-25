package com.jamallo.service.cesta.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CestaItemDTO {
    private Long productoId;
    private int cantidad;
}