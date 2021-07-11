import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];

    getAll(): Movie[] {
        return this.movies;
    }

    getOne(id:number): Movie {
        const movie = this.movies.find(movie => movie.id === id);
        if(!movie){
            throw new NotFoundException(`Movie with ID ${id} not found.`); // NestJS 가 제공하는 예외 처리
        }
        return movie;
    }

    deleteOne(id: number) {
        this.getOne(id); // getOne이 동작한다면 밑의 동작도 실행 될 것임.
        this.movies = this.movies.filter(movie => movie.id !== id); // this.movies를 delete한것으로 update해줌.
    }

    create(movieData: CreateMovieDto){ // movieData 는 json 값 
        this.movies.push({
            id: this.movies.length + 1,
            ...movieData,
        })
    }

    update(id:number, updateData: UpdateMovieDto){
        const movie = this.getOne(id);
        this.deleteOne(id);
        this.movies.push({...movie, ...updateData }); // 과거의 movie data에 updateData를 push 해줌.
    }
}
