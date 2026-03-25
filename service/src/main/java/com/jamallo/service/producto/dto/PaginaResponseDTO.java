package com.jamallo.service.producto.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@AllArgsConstructor
@Getter @Setter
public class PaginaResponseDTO <T> {
    private List<T> contenido;
    private int paginaActual;
    private int tamanioPaginas;
    private long totalElementos;
    private int totalPaginas;

    public static <T> PaginaResponseDTO<T> fromPage(Page<T> page) {
        return new PaginaResponseDTO<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}