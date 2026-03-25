package com.jamallo.service.pedido.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class PedidoResponseDTO {
    private Long id;
    private BigDecimal total;
    private String estado;
}