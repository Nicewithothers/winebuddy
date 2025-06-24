package com.nicewithothers.winebuddy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.IncorrectResultSetColumnCountException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;

@RestControllerAdvice
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

    @ExceptionHandler(ParseException.class)
    public ResponseEntity<String> handleParseException(final ParseException pe) {
        return new ResponseEntity<>(pe.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IncorrectResultSetColumnCountException.class)
    public ResponseEntity<String> handleIncorrectResultSetColumnCountException(final IncorrectResultSetColumnCountException ic) {
        return new ResponseEntity<>(ic.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
