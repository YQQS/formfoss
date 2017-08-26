package se.sjtu.formfoss.security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import se.sjtu.formfoss.security.service.JwtAuthEntryPoint;
import se.sjtu.formfoss.security.service.JwtAuthFilter;
import se.sjtu.formfoss.security.service.JwtAuthProvider;
import se.sjtu.formfoss.security.service.JwtAuthSuccessHandler;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableAutoConfiguration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Value("${url.public}")
    private String publicUrl;

    @Value("${url.authentication}")
    private String authenticationUrl;

    @Autowired
    private JwtAuthEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthProvider authProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManager() throws Exception {
        List<AuthenticationProvider> providerList = new ArrayList<>();
        providerList.add(authProvider);
        return new ProviderManager(providerList);
    }

    @Bean
    public JwtAuthFilter jwtAuthFilterBean() throws Exception {
        JwtAuthFilter filter = new JwtAuthFilter(authenticationUrl + "/**");

        filter.setAuthenticationManager(authenticationManager());
        filter.setAuthenticationSuccessHandler(new JwtAuthSuccessHandler());

        return filter;
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // disable CSRF
                .csrf().disable()
                // call error handler if failed
                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
                // do not create session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                // request authorization
                .authorizeRequests()
                .antMatchers(publicUrl + "/**").permitAll()
                .antMatchers(authenticationUrl + "/**").authenticated()
                .anyRequest().denyAll()

        .and()
                .addFilterBefore(jwtAuthFilterBean(), UsernamePasswordAuthenticationFilter.class);

        // disable page caching
        httpSecurity.headers().cacheControl();

    }
}
