package se.sjtu.formfoss.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import se.sjtu.formfoss.model.UserEntity;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    /**
     * Tries to parse specified String as a JWT token. If successful, returns User object with username, id and role prefilled (extracted from token).
     * If unsuccessful (token is invalid or not containing all required user properties), simply returns null.
     *
     * @param token the JWT token to parse
     * @return the User object extracted from specified token or null if a token is invalid.
     */
    public UserEntity parseToken(String token) {
        try {
            Claims body = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            UserEntity user = new UserEntity();
            user.setUserName(body.getSubject());
            user.setUserId(Integer.parseInt((String) body.get("userId")));
            user.setUserRole((String) body.get("userRole"));

            return user;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Generates a JWT token containing username as subject, and userId and role as additional claims. These properties are taken from the specified
     * User object. Tokens validity is infinite.
     *
     * @param user for which the token will be generated
     * @return the JWT token
     */
    public String generateToken(UserEntity user) {
        Claims claims = Jwts.claims().setSubject(user.getUserName());
        claims.put("userId", user.getUserId().toString());
        claims.put("userRole", user.getUserRole());

        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
}
