package com.example.melearnbe.model;

import com.example.melearnbe.enums.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Word {
    @Id @GeneratedValue
    private Long id;
    @ManyToOne
    private WordList wordList;
    private String content;

}
