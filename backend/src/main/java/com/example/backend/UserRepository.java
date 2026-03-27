package com.example.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(User user); // 아이디로 사용자 찾기
    Optional<User> findByUsernameAndPassword(String username, String password);
}