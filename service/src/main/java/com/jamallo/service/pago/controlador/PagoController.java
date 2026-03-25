package com.jamallo.service.pago.controlador;


import com.jamallo.service.pago.service.PagoService;
import com.jamallo.service.pedido.modelo.Pedido;
import com.jamallo.service.pedido.service.PedidoService;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/pago")
public class PagoController {

    private final PagoService pagoService;
    private final PedidoService pedidoService;

    @PostMapping("/crear-payment-intent")
    public ResponseEntity<Map<String, String>> crearPaymentIntent (
            @AuthenticationPrincipal String email
    ) {
        Pedido pedido = pedidoService.obtenerPedidoPendiente(email);

        PaymentIntent intent = pagoService.crearPaymentIntent(pedido.getTotal());

        pedidoService.asignarPaymentIntent(
                pedido.getId(),
                intent.getId()
        );

        return ResponseEntity.ok(
                Map.of("clientSecret", intent.getClientSecret())
        );
    }

    /*@PostMapping("/crear-payment-intent")
    public ResponseEntity<Map<String, String>> crearPaymentIntent (
            @AuthenticationPrincipal String email
    ) {
        PaymentIntent intent = pagoService.crearPaymentIntent(
                new BigDecimal("10.00")
                );
        return ResponseEntity.ok(
                Map.of("ClientSecret", intent.getClientSecret())
        );
    }*/
}
