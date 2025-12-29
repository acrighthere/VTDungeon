package org.acrighthere.lab4.backend.handler;

import org.acrighthere.lab4.backend.dto.ErrorResponse;
import org.acrighthere.lab4.backend.exception.InvalidCredentialsException;
import org.acrighthere.lab4.backend.exception.InvalidPointException;
import org.acrighthere.lab4.backend.exception.InvalidRefreshTokenException;
import org.acrighthere.lab4.backend.exception.UnauthorizedException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCreds(InvalidCredentialsException ex) {
        return ResponseEntity.status(401).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<ErrorResponse> handleRefresh(InvalidRefreshTokenException ex) {
        return ResponseEntity.status(401).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleOther(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse("Internal server error"));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(401).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(InvalidPointException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPoint(InvalidPointException ex) {
        return ResponseEntity.status(400).body(new ErrorResponse(ex.getMessage()));
    }
}

