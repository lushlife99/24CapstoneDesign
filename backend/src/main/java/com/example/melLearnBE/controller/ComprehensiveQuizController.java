package com.example.melLearnBE.controller;

import com.example.melLearnBE.dto.request.QuizRequest;
import com.example.melLearnBE.dto.response.ComprehensiveQuizDto;
import com.example.melLearnBE.service.ComprehensiveQuizService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comprehensive-quiz")
public class ComprehensiveQuizController {

    private final ComprehensiveQuizService comprehensiveQuizService;

    @PostMapping
    public ComprehensiveQuizDto getComprehensiveQuiz(@RequestBody QuizRequest quizRequest, HttpServletRequest request) throws ExecutionException, InterruptedException {
        return comprehensiveQuizService.getComprehensiveQuiz(quizRequest, request);
    }
}
