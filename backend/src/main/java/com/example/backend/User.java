package com.example.backend;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users") // H2에서 'user'는 예약어일 수 있어 테이블명을 지정합니다.
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // 아이디
    private String password; // 비밀번호
    private String role;     // 권한 (USER 또는 ADMIN)
}