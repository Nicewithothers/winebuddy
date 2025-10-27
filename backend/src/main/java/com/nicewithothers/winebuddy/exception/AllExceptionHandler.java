package com.nicewithothers.winebuddy.exception;

import com.nicewithothers.winebuddy.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.IncorrectResultSetColumnCountException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Arrays;

@RestControllerAdvice
public class AllExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(final Exception e) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(e.getMessage())
                .path(Arrays.toString(e.getStackTrace()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(final AuthorizationDeniedException ade) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ade.getMessage())
                .path(Arrays.toString(ade.getStackTrace()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleStatusException(final ResponseStatusException rse) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(rse.getMessage())
                .path(Arrays.toString(rse.getStackTrace()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(errorResponse, rse.getStatusCode());
    }

    @ExceptionHandler(ParseException.class)
    public ResponseEntity<ErrorResponse> handleParseException(final ParseException pe) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(pe.getMessage())
                .path(Arrays.toString(pe.getStackTrace()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IncorrectResultSetColumnCountException.class)
    public ResponseEntity<ErrorResponse> handleIncorrectResultSetColumnCountException(final IncorrectResultSetColumnCountException ic) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message(ic.getMessage())
                .path(Arrays.toString(ic.getStackTrace()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
