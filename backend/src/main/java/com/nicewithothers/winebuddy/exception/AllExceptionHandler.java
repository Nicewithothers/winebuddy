package com.nicewithothers.winebuddy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class AllExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(final Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<String> handleAuthException(final AuthorizationDeniedException ade) {
        return new ResponseEntity<>(ade.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleStatusException(final ResponseStatusException rse) {
        return new ResponseEntity<>(rse.getMessage(), rse.getStatusCode());
    }
}
