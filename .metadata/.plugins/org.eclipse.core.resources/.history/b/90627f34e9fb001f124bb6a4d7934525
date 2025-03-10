package com.lms.attendance.repository;

import java.util.List;


import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.lms.attendance.model.Post;

@Mapper
public interface PostMapper {

    @Insert("""
        INSERT INTO Post (post_id, board_id, author_id, author_role, author, title, content)
        VALUES (#{postId}, #{boardId}, #{authorId}, #{authorRole}, #{author}, #{title}, #{content})
    """)
    void createPost(Post newPost);
    
    @Delete("DELETE FROM Post WHERE post_id = #{postId}")
    void deletePostByPostId(int postId);
 
    //---------------게시글 수정 기능
    @Update("""
    	    UPDATE Post 
    	    SET title = #{title}, content = #{content}, author = #{author}
    	    WHERE post_id = #{postId}
    	""")
    	void updatePost(
    		@Param("postId") int postId,
    	    @Param("title") String title,
    	    @Param("content") String content,
    	    @Param("author") String author
    	);
    
  //조건에 맞는 게시글 가져오기
    @Select("SELECT title, created_at, author_role, author FROM Post WHERE board_id = #{boardId};")
    List<Post> getAllPosts(int boardId);
    
    // title로 게시글 검색
    @Select("SELECT * FROM Post WHERE title LIKE CONCAT('%', #{title}, '%')")
    List<Post> searchPostsByTitle(String title);
}
    


