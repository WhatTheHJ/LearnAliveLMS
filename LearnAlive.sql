-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: jw0ch9vofhcajqg7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com    Database: ek99azczhl3slsnr
-- ------------------------------------------------------
-- Server version	8.0.35

use LearnAliveDB;

select * from Student;
DELETE FROM student WHERE student_id = '1234' LIMIT 1;
ALTER TABLE Student ADD PRIMARY KEY (student_id);
ALTER TABLE student DROP PRIMARY KEY;
SHOW CREATE TABLE student;
select * from Professor;
select * from Post;
select * from Class;
select * from board;
SELECT * FROM post WHERE board_id = 1;
SELECT * FROM board WHERE board_id = 1;
select * from exam_score;




/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `Attendance`
--

DROP TABLE IF EXISTS `Attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL,
  `class_id` int NOT NULL,
  `date` date NOT NULL,
  `state` enum('present','absent','late','excused') DEFAULT 'absent',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `reason` text,
  PRIMARY KEY (`attendance_id`),
  KEY `attendance_ibfk_2` (`class_id`),
  KEY `attendance_ibfk_1` (`student_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Student` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `Attendance_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `Class` (`class_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=474 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Class`
--

DROP TABLE IF EXISTS `Class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(255) NOT NULL,
  `prof_id` varchar(50) DEFAULT NULL,
  `start_time` time NOT NULL DEFAULT '09:00:00',
  `end_time` time NOT NULL DEFAULT '11:00:00',
  `present_start` time NOT NULL DEFAULT '08:45:00',
  `present_end` time NOT NULL DEFAULT '09:15:00',
  `late_end` time NOT NULL DEFAULT '11:00:00',
  PRIMARY KEY (`class_id`),
  KEY `prof_id` (`prof_id`),
  CONSTRAINT `Class_ibfk_1` FOREIGN KEY (`prof_id`) REFERENCES `Professor` (`prof_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

ALTER TABLE Class
ADD COLUMN score DECIMAL(5,2) DEFAULT NULL COMMENT '강의별 점수',
ADD COLUMN grade VARCHAR(2) DEFAULT NULL COMMENT '등급';

ALTER TABLE Class
ADD COLUMN description TEXT;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `board_id` int DEFAULT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `author_role` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `view` int DEFAULT '0',
  `likes` int DEFAULT '0',
  `liked_by_user` text,
  `file_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `fk_post_board` (`board_id`),
  CONSTRAINT `fk_post_board` FOREIGN KEY (`board_id`) REFERENCES `board` (`board_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DELIMITER //
CREATE TRIGGER after_class_insert
AFTER INSERT ON Class
FOR EACH ROW
BEGIN
    -- "공지사항" 기본 게시판 추가
    INSERT INTO board (class_id, board_name, is_default)
    VALUES (NEW.class_id, '공지사항', 0);

    -- "학습자료실" 기본 게시판 추가
    INSERT INTO board (class_id, board_name, is_default)
    VALUES (NEW.class_id, '학습자료실', 0);
END //

DELIMITER ;

DROP TRIGGER IF EXISTS after_class_insert;

--
-- Table structure for table `Professor`
--

DROP TABLE IF EXISTS `Professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Professor` (
  `prof_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `university` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL DEFAULT '1234',
  PRIMARY KEY (`prof_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

ALTER TABLE Professor ADD COLUMN phone VARCHAR(100);
ALTER TABLE Professor ADD COLUMN university VARCHAR(100);


INSERT INTO Professor (prof_id, name, university, department, email, phone, password)
VALUES ('20250001', '이응수', 'ㅇㅇ대학', '컴퓨터공학과', 'abc123@naver.com', '010-1234-5678', '1234');

DELETE FROM Professor WHERE prof_id = '20250001';

--
-- Table structure for table `Student`
--

DROP TABLE IF EXISTS `Student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student` (
  `student_id` varchar(50) NOT NULL,
  `university` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  `class_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_class` (`student_id`,`class_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `Student_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `Class` (`class_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=519 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

ALTER TABLE Student ADD COLUMN phone VARCHAR(100);
SHOW TABLES;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `board_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `board_name` varchar(255) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`board_id`),
  KEY `fk_board_class` (`class_id`),
  CONSTRAINT `fk_board_class` FOREIGN KEY (`class_id`) REFERENCES `Class` (`class_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_board`
--

DROP TABLE IF EXISTS `survey_board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_board` (
  `board_id` int NOT NULL AUTO_INCREMENT,
  `class_id` int NOT NULL,
  PRIMARY KEY (`board_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `survey_board_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `Class` (`class_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_post`
--

DROP TABLE IF EXISTS `survey_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_post` (
  `survey_id` int NOT NULL AUTO_INCREMENT,
  `board_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`survey_id`),
  KEY `board_id` (`board_id`),
  CONSTRAINT `survey_post_ibfk_1` FOREIGN KEY (`board_id`) REFERENCES `survey_board` (`board_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_question`
--

DROP TABLE IF EXISTS `survey_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_question` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `survey_id` int NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('radio','checkbox','text','linear_scale') NOT NULL,
  `options` json DEFAULT NULL,
  `min_select` int DEFAULT NULL,
  `max_select` int DEFAULT NULL,
  `min_value` int DEFAULT NULL,
  `max_value` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_required` tinyint(1) DEFAULT '0',
  `min_label` varchar(255) DEFAULT NULL,
  `max_label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `survey_id` (`survey_id`),
  CONSTRAINT `survey_question_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey_post` (`survey_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `survey_response`
--

DROP TABLE IF EXISTS `survey_response`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_response` (
  `survey_id` int NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `question_id` int NOT NULL,
  `response` text NOT NULL,
  PRIMARY KEY (`survey_id`,`user_id`,`question_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `survey_response_ibfk_1` FOREIGN KEY (`survey_id`) REFERENCES `survey_post` (`survey_id`) ON DELETE CASCADE,
  CONSTRAINT `survey_response_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `survey_question` (`question_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-07 14:52:48

-- 성적 데이터를 저장할 Grade 테이블 생성
CREATE TABLE Grade (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,     -- 학생 ID (Attendance 테이블과 동일한 방식)
    class_id INT NOT NULL,                -- 강의 ID
    grade DECIMAL(5,2) DEFAULT NULL,       -- 강의별 성적 (예: 100.00 만점)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_class (student_id, class_id),
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES Student(student_id),
    CONSTRAINT fk_grade_class FOREIGN KEY (class_id) REFERENCES Class(class_id)
);

-- 각 강의(클래스)와 학생에 대해 점수와 등급을 저장하는 테이블
CREATE TABLE exam_score (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    score DOUBLE DEFAULT 0,
    grade VARCHAR(3) DEFAULT 'F',
    FOREIGN KEY (class_id) REFERENCES Class(class_id),
    FOREIGN KEY (student_id) REFERENCES Student(student_id)
);