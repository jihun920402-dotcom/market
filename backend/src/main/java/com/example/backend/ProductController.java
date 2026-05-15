package com.example.backend;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;

    private String uploadPath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

    @GetMapping
    public List<Product> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "latest") String sort) {

        List<Product> products = productRepository.findAll();

        if (keyword != null && !keyword.isBlank()) {
            products = products.stream()
                    .filter(p -> p.getName() != null && p.getName().contains(keyword))
                    .collect(Collectors.toList());
        }
        if (category != null && !category.isBlank()) {
            Category cat = Category.valueOf(category);
            products = products.stream()
                    .filter(p -> p.getCategory() == cat)
                    .collect(Collectors.toList());
        }

        Comparator<Product> comparator = switch (sort) {
            case "price_asc"  -> Comparator.comparing(Product::getPrice, Comparator.nullsLast(Comparator.naturalOrder()));
            case "price_desc" -> Comparator.comparing(Product::getPrice, Comparator.nullsLast(Comparator.reverseOrder()));
            default           -> Comparator.comparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));
        };
        products.sort(comparator);

        return products;
    }

    @PostMapping
    public Product createProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Long price,
            @RequestParam("seller") String seller,
            @RequestParam("address") String address,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", defaultValue = "OTHER") String category,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        String fileName = saveImage(image);

        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setSeller(seller);
        product.setAddress(address);
        product.setDescription(description);
        product.setCategory(Category.valueOf(category));
        product.setImageName(fileName);

        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long price,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (name != null) product.setName(name);
        if (price != null) product.setPrice(price);
        if (address != null) product.setAddress(address);
        if (description != null) product.setDescription(description);
        if (category != null) product.setCategory(Category.valueOf(category));
        if (status != null) product.setStatus(ProductStatus.valueOf(status));
        if (image != null && !image.isEmpty()) {
            product.setImageName(saveImage(image));
        }

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

    private String saveImage(MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) return null;
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        image.transferTo(new File(uploadPath + fileName));
        return fileName;
    }
}
