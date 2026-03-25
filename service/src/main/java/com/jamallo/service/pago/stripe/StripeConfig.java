package com.jamallo.service.pago.stripe;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class StripeConfig {

    private final StripePropiedades stripePropiedades;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripePropiedades.getSecretKey();
    }
}
