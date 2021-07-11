import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMovieDto{
    @IsString()
    readonly title: string;
    
    @IsNumber()
    readonly year: number;

    @IsOptional() // 장르를 입력하는 것이 필수가 아니라면 IsOptional 데코레이터 사용
    @IsString({ each: true })
    readonly genres: string[];
}