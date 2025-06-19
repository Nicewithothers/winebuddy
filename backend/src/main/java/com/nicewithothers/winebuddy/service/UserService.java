package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.mapper.UserMapper;
import com.nicewithothers.winebuddy.model.User;
import com.nicewithothers.winebuddy.model.Vineyard;
import com.nicewithothers.winebuddy.model.dto.user.RegisterRequest;
import com.nicewithothers.winebuddy.model.dto.user.UserDto;
import com.nicewithothers.winebuddy.model.enums.Roles;
import com.nicewithothers.winebuddy.repository.UserRepository;
import com.nicewithothers.winebuddy.repository.VineyardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final VineyardRepository vineyardRepository;

    public UserDto registerUser(RegisterRequest registerRequest) {
        try {
            boolean isNotExistingUser = userRepository.existsByUsername(registerRequest.getUsername());
            boolean isNotExistingEmail = userRepository.existsByEmail(registerRequest.getEmail());
            if (isNotExistingUser) {
                throw new IllegalArgumentException("Username is already taken!");
            }

            if (isNotExistingEmail) {
                throw new IllegalArgumentException("Email is already taken!");
            }

            User user = User.builder()
                    .username(registerRequest.getUsername())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .created(Instant.now())
                    .role(Roles.USER)
                    .vineyard(null)
                    .build();
            return userMapper.toUserDto(userRepository.save(user));
        } catch (Exception e) {
            throw new RuntimeException(String.format("Could not register user: %s", registerRequest.getUsername()), e);
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException(String.format("Username %s not found", username))
        );
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username);

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())))
                .build();
    }

    public void deleteUserVineyard(User user) {
        Vineyard vineyard = user.getVineyard();
        if (vineyard != null) {
            user.setVineyard(null);
            userRepository.save(user);
            vineyardRepository.delete(vineyard);
        }
    }
}
