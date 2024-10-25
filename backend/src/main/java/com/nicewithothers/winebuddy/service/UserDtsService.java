package com.nicewithothers.winebuddy.service;

import com.nicewithothers.winebuddy.models.Roles;
import com.nicewithothers.winebuddy.models.User;
import com.nicewithothers.winebuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDtsService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found!"));
        return (UserDetails) User.builder()
                .userName(user.getUserName())
                .password(user.getPassword())
                .role(Roles.valueOf(String.valueOf(user.getRole())))
                .build();
    }
}
