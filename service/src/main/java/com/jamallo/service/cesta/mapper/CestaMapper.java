package com.jamallo.service.cesta.mapper;

import com.jamallo.service.cesta.dto.CestaItemDTO;
import com.jamallo.service.cesta.dto.CestaResponseDTO;
import com.jamallo.service.cesta.modelo.Cesta;

import java.util.stream.Collectors;

public class CestaMapper {

    public static CestaResponseDTO toDto(Cesta cesta) {
        CestaResponseDTO dto = new CestaResponseDTO();

        dto.setItems(
                cesta.getItems().stream().map(item -> {
                    CestaItemDTO i = new CestaItemDTO();
                    i.setProductoId(item.getProducto().getId());
                    i.setCantidad(item.getCantidad());
                    return i;
                }).collect(Collectors.toList())
        );
        return dto;
    }
}