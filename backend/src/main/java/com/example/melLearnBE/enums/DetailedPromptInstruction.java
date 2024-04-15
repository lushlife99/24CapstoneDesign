package com.example.melLearnBE.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum DetailedPromptInstruction {

    COMMON("Please create total 5 quizzes. "),
    READING_OPTIONLIST_LANG_LEVEL1("Please write the language in Korean when you write the option list. "),
    READING_OPTIONLIST_LANG_LEVEL2("Please short the sentences in the 'optionlist'. "),
    READING_OPTIONLIST_LANG_LEVEL3("Please lengthen the sentences in the options list. There must be at least 15 words that make up the sentences. "),
    READING_OPTIONLIST_LANG_TYPE("Please write the optionlist's language in"),
    LISTENING_LEVEL1("Please provide Quiz with a total of 10 answer"),
    LISTENING_LEVEL2("Please provide Quiz with a total of 20 answer"),
    LISTENING_LEVEL3("Please provide Quiz with a total of 30 answer"),

    ;

    private final String detail;
}
