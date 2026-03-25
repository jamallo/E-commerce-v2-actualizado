package com.jamallo.service.seguridad.jwt;

import com.jamallo.service.entidad.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

import com.jamallo.service.seguridad.jwt.ServicioJwt;

@Service
public class ServicioJwtImpl implements ServicioJwt {

    private static final String CLAVE_SECRETA = "clave_secreta_super_segura_clave_secreta_super_segura_256bits_minimo_funciona";

    private static final long EXPIRACION = 1000 * 60 * 60; //1 hora

    private final SecretKey clave;

    public ServicioJwtImpl() {
        this.clave = Keys.hmacShaKeyFor(CLAVE_SECRETA.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String generarToken(Usuario usuario) {

        List<String> roles = usuario.getRoles()
                .stream()
                .map(rol -> rol.getNombre())
                .toList();

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRACION))
                .signWith(clave)
                .compact();
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<String> extraerRoles(String token) {
        Claims claims = obtenerClaims(token);
        return (List<String>) claims.get("roles");
    }

    @Override
    public  String extraerEmail(String token) {
        return obtenerClaims(token).getSubject();
    }

    @Override
    public boolean esTokenValido(String token) {
        try {
            obtenerClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims obtenerClaims(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}