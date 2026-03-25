package com.jamallo.service.pago.dto;


import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class PagoRequest {
    private BigDecimal importe;
}
