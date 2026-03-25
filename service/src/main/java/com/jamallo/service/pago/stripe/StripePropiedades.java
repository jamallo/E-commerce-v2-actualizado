package com.jamallo.service.pago.stripe;

import com.stripe.net.Webhook;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter @Setter
@Component
@ConfigurationProperties(prefix = "stripe")
public class StripePropiedades {
    //Clave secreta
    private String secretKey;
    //Clave pública
    private String publicKey;
    //CLI
    private Webhook webhook = new Webhook();

    @Getter @Setter
    public static class Webhook {
        private String secret;

    }


}
