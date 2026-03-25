package com.jamallo.service.pago.controlador;

import com.jamallo.service.pago.service.PagoService;
import com.jamallo.service.pago.stripe.StripeServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/webhook/stripe")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final StripeServiceImpl stripeService;

    @PostMapping
    public ResponseEntity<String> recibirEvento(
            HttpServletRequest request
    ) throws IOException {

        String payload = new String(
                request.getInputStream().readAllBytes(),
                StandardCharsets.UTF_8
        );
        String sigHeader = request.getHeader("Stripe-Signature");

        log.info("Webhook recibido - Firma: {}, Payload length: {}",
                sigHeader, payload.length());

        stripeService.procesarEventoStripe(payload, sigHeader);
        return ResponseEntity.ok("Evento recibido");
    }

}
