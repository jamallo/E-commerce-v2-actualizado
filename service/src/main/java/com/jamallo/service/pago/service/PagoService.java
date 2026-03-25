package com.jamallo.service.pago.service;

import com.stripe.model.PaymentIntent;

import java.math.BigDecimal;

public interface PagoService {

    PaymentIntent crearPaymentIntent(BigDecimal importe);

    void procesarEventoStripe(String payload, String signature);
}
