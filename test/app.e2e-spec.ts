import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe('movies', () => { //getAll 함수에서 배열이 리턴되는 요청
    it("GET", () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([]); // 처음에 빈 데이터베이스므로 빈 배열이 반환되야함
    });
    it("POST 201", () => {
      return request(app.getHttpServer())
        .post("/movies")
        .send({
          title:"Test",
          year:2000,
          genres: ['test'],
        })
        .expect(201); // POST가 성공적으로 되었을 때 201
    });
    it("POST 400", () => { // 잘못된 정보를 create 한 경우를 test
      return request(app.getHttpServer())
        .post("/movies")
        .send({
          title:"Test",
          year:2000,
          genres: ['test'],
          other: 'thing',
        })
        .expect(400); // 잘못된 요청 
    });
    it("DELETE", () => {
      return request(app.getHttpServer())
        .delete('/movies')
        .expect(404) // 오류가 나는지 확인 (처음엔 빈 데이터베이스 이기 때문에 삭제하면 오류가남)
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200);
    });
    it('GET 404', () => {
      return request(app.getHttpServer())
        .get('/movies/999')
        .expect(404);
    });
    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({title:'Updated Test'})
        .expect(200);
    })
    it('DELETE 200', () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200);
    })

  })

  
});
