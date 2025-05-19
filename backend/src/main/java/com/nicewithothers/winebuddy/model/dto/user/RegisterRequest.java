package com.nicewithothers.winebuddy.model.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required!")
    private String username;

    @NotBlank(message = "Email is required!")
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", message = "Email format is wrong! Try again!")
    private String email;

    @NotBlank(message = "Password is required!")
    private String password;
}
