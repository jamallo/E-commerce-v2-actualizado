package com.jamallo.service.pago.stripe;

import com.jamallo.service.pago.dto.PagoResponseDTO;
import com.jamallo.service.pago.service.PagoService;
import com.jamallo.service.pedido.modelo.Pedido;
import com.jamallo.service.pedido.service.PedidoService;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StripeServiceImpl implements PagoService {

    private final StripePropiedades stripePropiedades;
    private final PedidoService pedidoService;


    @PostConstruct
    public void init() {
        Stripe.apiKey = stripePropiedades.getSecretKey();
    }


    @Override
    public PaymentIntent crearPaymentIntent(BigDecimal importe) {

        long amountInCents = importe
                .multiply(BigDecimal.valueOf(100))
                .longValueExact();

        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setAmount(amountInCents)
                        .setCurrency("eur")
                        .setAutomaticPaymentMethods(
                                PaymentIntentCreateParams.AutomaticPaymentMethods
                                        .builder()
                                        .setEnabled(true)
                                        .build()
                        )
                        .build();

        try {
            return PaymentIntent.create(params);
        } catch (Exception e) {
            throw new RuntimeException("Error creando PaymentIntent en Stripe", e);
        }
    }

    @Override
    public void procesarEventoStripe(String payload, String sigHeader) {

        if (sigHeader == null) {
            throw new IllegalArgumentException("Stripe-Signature header is missing");
        }
        Event event;

        try {
            event = Webhook.constructEvent (
                    payload,
                    sigHeader,
                    stripePropiedades.getWebhook().getSecret()
            );
        } catch (Exception e) {
            throw new RuntimeException("Firma Stripe inválida", e) ;
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                            .getObject()
                                    .orElseThrow();

                pedidoService.marcarPedidoComoPagado(intent.getId());
        }
    }
}
