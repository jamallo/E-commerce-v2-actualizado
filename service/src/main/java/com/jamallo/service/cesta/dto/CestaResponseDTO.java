package com.jamallo.service.cesta.dto;

import com.jamallo.service.cesta.dto.CestaItemDTO;
import lombok.Data;

import java.util.List;

@Data
public class CestaResponseDTO {
    private List<CestaItemDTO> items;
    private double total;
}