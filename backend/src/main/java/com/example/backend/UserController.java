package com.example.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @PostMapping("/login")
    public User login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        return userRepository.findByUsernameAndPassword(username, password)
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호 오류"));
    }

  @PostMapping("/setup")
public String setup() {
    userRepository.deleteAll();
    productRepository.deleteAll();

    userRepository.save(new User(null, "admin", "1234", "ADMIN"));
    userRepository.save(new User(null, "user1", "1234", "USER"));
    userRepository.save(new User(null, "user2", "1234", "USER"));

    // 파일 확장자(jpg)가 실제 파일과 일치하는지 꼭 확인하세요!
    productRepository.save(createExampleProduct("빈티지 자전거", 150000L, "admin", "서울 강남구", "bike.jpg"));
    productRepository.save(createExampleProduct("중고 아이패드", 450000L, "user1", "대구 중구", "ipad.jpg"));
    productRepository.save(createExampleProduct("캠핑용 의자", 30000L, "user2", "서울 마포구", "chair.jpg"));

    return "계정과 예시 상품 3개가 생성되었습니다. (폴더: uploads)";
}
    private Product createExampleProduct(String name, Long price, String seller, String address, String imageName) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setSeller(seller);
        p.setAddress(address);
        p.setImageName(imageName); // DB에 저장될 파일명
        return p;
    }
}