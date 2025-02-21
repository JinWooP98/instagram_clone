package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.post.dto.PostCreate;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


/**
 * HTTP request message - 클라이언트가 요청보낼 때 쓰는 문서
 *
 * 서버에 JSON을 전송
 *
 * POST /api/posts HTTP/1.1
 * Content-type: image/jpeg
 *
 * ==========================
 * body 내용
 *
 * ------------------------------------------
 *
 * 서버에 JSON과 미디어를 동시에 전송
 * POST /api/posts HTTP/1.1
 *
 * Content-type: multipart/form-data
 * boundary: abc
 * ============================
 * Content-type: application/json
 * { "writer": "", "content": " }
 *
 * --- abc
 *
 * Content-type: image/jpeg
 * 이미지 파일
 */

@RestController
@RequestMapping("/api/posts")
@Slf4j
public class PostController {

    //피드 생성 요청
    @PostMapping
    public ResponseEntity<?> createFeed(
            // 피드 내용, 작성자 이름 JSON { "writer": "", "content": "" } -> 검증
            @RequestPart("feed") @Valid PostCreate postCreate,
            // 이미지 파일 목록 multipart-file
            @RequestPart("images") List<MultipartFile> images
    ) {

        images.forEach(image -> {
            log.info("uploaded image file name - {}", image.getOriginalFilename());
        });

        log.info("feed create request: POST = {}", postCreate);


        return ResponseEntity
                .ok()
                .body(null);
    }
}
