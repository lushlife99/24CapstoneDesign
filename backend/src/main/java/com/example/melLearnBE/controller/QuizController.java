package com.example.melLearnBE.controller;

import com.example.melLearnBE.dto.model.QuizListDto;
import com.example.melLearnBE.dto.model.QuizSubmitDto;
import com.example.melLearnBE.dto.request.QuizRequest;
import com.example.melLearnBE.dto.request.QuizSubmitRequest;
import com.example.melLearnBE.service.QuizService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    @PostMapping
    public QuizListDto getQuizList(@RequestBody QuizRequest quizRequest, HttpServletRequest request) {
        QuizListDto quizList = quizService.getQuizList(quizRequest, request);
        return quizList;
    }

    @PostMapping("/submit")
    public QuizSubmitDto submit(@RequestBody QuizSubmitRequest quizSubmitRequest, HttpServletRequest request) {
        return quizService.submit(quizSubmitRequest, request);
    }

}
