import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import e from 'express';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {

    it("should return an array", () => {

      const result = service.getAll();
      
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe("getOne", () => {
    it("should return a movie", () => {
      service.create({
        title:"Test Movie",
        genres: ['test'],
        year: 2000,
      });
      const movie = service.getOne(1); // id는 1을 가질것임.
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });
    it("should throw 404 error", () => {
      try{
        service.getOne(999); /// id를 999 갖고있을 일이 없으니 에러가 발생해야함.
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID 999 not found.');
      }
    });
  });

  describe("deleteOne", () => {

    it("deletes a movie", () => {
      service.create({
        title:"Test Movie",
        genres: ['test'],
        year: 2000,
      });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1); // 1개 삭제
      const afterDelete = service.getAll().length; // 삭제 후 영화 목록

      expect(afterDelete).toBeLessThan(beforeDelete); // 삭제하면 보다 적어야함.(toBeLessThan)

    });
    it('should return a 404', () => {
      try {
        service.deleteOne(999);
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("create", () => {

    it("should create a movie", () => {
      const beforeCreate = service.getAll().length;
      service.create({
        title:"Test Movie",
        genres: ['test'],
        year: 2000,
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe("update", () => {
    it("should update a movie", () => {
      service.create({
        title:"Test Movie",
        genres: ['test'],
        year: 2000,
      });
      service.update(1, {title:"Updated Test"});
      const movie = service.getOne(1);
      expect(movie.title).toEqual("Updated Test");
    });
    it('should throw a NotFoundException', () => {
      try {
        service.update(999, {});
      } catch(e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  })
});
