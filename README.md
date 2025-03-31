### 1. JWT 유틸 클래스 추가
유틸패키지에 생성

### 2. 컨트롤러 수정
   authcontroller
   professorcontroller
   studentcontroller

### 3. pom.xml 추가
   <!--Jwt Token 발-->
    <!-- JJWT Core API -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>

    <!-- JJWT Implementation -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- JJWT JSON 처리 (Jackson) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>


### 4. 시큐리티 컨피그 파일 수정
   jwt 인증필터 추가




<프론트엔드>
### 1. Api -> authApi.js 수정
### 2. contexts -> AuthProvider 수정


