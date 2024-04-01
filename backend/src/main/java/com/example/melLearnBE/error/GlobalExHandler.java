package com.example.melLearnBE.error;

import com.example.melLearnBE.dto.model.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
public class GlobalExHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler(value = { CustomException.class })
    protected ResponseEntity<ErrorResponse> handleHttpCustomException(CustomException e) {
        log.error("handleHttpCustomException throw CustomException : {}", e.getErrorCode());
        e.printStackTrace();
        return ErrorResponse.toResponseEntity(e.getErrorCode());
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return new ResponseEntity<>("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
