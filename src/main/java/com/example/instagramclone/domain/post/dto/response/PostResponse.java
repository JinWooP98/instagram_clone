package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.PostImage;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/*

{
    "feed_id" : 27,
    "content" : "내용",
    "writer" : "작성자",
    "images" : [
        {
            "image_id" : 32,
            "imageUrl" : "/uploads/이미지제목.jpg"
            "imageOrder" : 2
        },
        {
            "image_id" : 33,
            "imageUrl" : "/uploads/이미지제목2.jpg"
            "imageOrder" : 1
        },
     ]
}

 */
@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {

    @JsonProperty("feed_id")
    private Long id;
    private String content;
    private String writer;
    private List<PostImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
