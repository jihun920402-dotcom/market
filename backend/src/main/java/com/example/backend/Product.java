package com.example.backend;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter 
@NoArgsConstructor 
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Long price;
    private String seller;
    private String address;
    private String imageName; // 추가: 저장된 이미지 파일명
}