package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.domain.post.dto.response.PostResponse;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.PostException;
import com.example.instagramclone.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;



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
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 피드 목록 조회 요청
    @GetMapping
    public ResponseEntity<?> getFeeds() {
        List<PostResponse> allFeeds = postService.findAllFeeds();

        return ResponseEntity
                .ok()
                .body(allFeeds);
    }

    //피드 생성 요청
    @PostMapping
    public ResponseEntity<?> createFeed(
            // 피드 내용, 작성자 이름 JSON { "writer": "", "content": "" } -> 검증
            @RequestPart("feed") @Valid PostCreate postCreate,
            // 이미지 파일 목록 multipart-file
            @RequestPart("images") List<MultipartFile> images
    ) {

        // 파일 업로드 개수 검증
        if(images.size() > 10) {
            throw new PostException(ErrorCode.TOO_MANY_FILES, "파일의 개수는 10개를 초과할 수 없습니다.");
        }

        images.forEach(image -> {
            log.info("uploaded image file name - {}", image.getOriginalFilename());
        });

        log.info("feed create request: POST = {}", postCreate);

        // 이미지와 JSON을 서비스클래스로 전송
        postCreate.setImages(images);

        Long newFeedPostId = postService.createFeed(postCreate);

        // 응답 메시지 JSON 생성 {"id": 23, "message": "save success"}
        Map<String, Object> response = Map.of(
                "id", newFeedPostId,
                "message", "save success"
        );


        return ResponseEntity
                .ok()
                .body(response);
    }
}
