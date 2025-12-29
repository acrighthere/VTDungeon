package org.acrighthere.lab4.backend.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException() {
        super("User is not authorized");
    }
}
