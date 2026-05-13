package com.example.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    
    // 프로젝트 루트 폴더 아래 uploads 폴더 지정
   
   private String uploadPath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Long price,
            @RequestParam("seller") String seller,
            @RequestParam("address") String address,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        String fileName = null;
        if (image != null && !image.isEmpty()) {
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            image.transferTo(new File(uploadPath + fileName));
        }

        // 생성자 에러를 피하기 위해 객체 생성 후 Setter로 값 세팅
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setSeller(seller);
        product.setAddress(address);
        product.setImageName(fileName);

        return productRepository.save(product); 
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }
}