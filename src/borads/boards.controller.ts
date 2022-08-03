import { LocationEntity } from 'src/borads/entities/locations.entity';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-api-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { multerOptions } from 'src/common/utills/multer.options';
import { UserEntity } from 'src/users/users.entity';
import { BoardsService } from './boards.service';
import { BoardDataEntity } from './entities/board-datas.entity';
import { BoardEntity } from './entities/boards.entity';
import { getManager, getRepository, Repository } from 'typeorm';

@Controller('boards')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class BoardsController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardEntitiy: Repository<BoardEntity>,
    @InjectRepository(BoardDataEntity)
    private readonly boardDataEntity: Repository<BoardDataEntity>,
    @InjectRepository(LocationEntity)
    private readonly LocationEntity: Repository<LocationEntity>,
    private readonly authService: AuthService,
    private readonly boardsService: BoardsService,
  ) {}

  @ApiOperation({ summary: '장소 이미지 업로드' })
  // 프론트에서 전송해주는 키 이름으로 인자 설정,
  // 사진 업로드 갯수 제한
  // 파일 업로드 조건(upload/cats 라는 폴더에 사진 파일 저장)
  @UseInterceptors(FileInterceptor('image', multerOptions('image')))
  @UseGuards(JwtAuthGuard)
  @Post('img')
  uploadBoardImg(
    @UploadedFile() files: Express.Multer.File,
    // @CurrentUser() user,
  ) {
    // console.log(user);
    // console.log(files.filename);
    // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
    // return this.boardsService.uploadImg(user, files);
    // 현재 url 경로를 return 해준다.
    return { location: `http://localhost:8000/media/image/${files.filename}` };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  postBoard(@CurrentUser() user, @Body() data) {
    // console.log(user);
    // console.log(data);
    return this.boardsService.postBoard(user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDetailBoard(@CurrentUser() user, @Param('id') id: string) {
    console.log(id);

    // const entityManager = getManager();
    // const [data] = await entityManager.query(
    //   // `select * from boards B join users U on B.userId = U.id where B.id = ${id}`,
    //   // `select * from boards B join users U on B.userId = U.id`,
    //   `select * from boards where id = ${id}`,
    // );
    // console.log(data);

    // const boardData = getRepository(BoardEntity)
    //   .createQueryBuilder('board')
    //   .leftJoinAndSelect('board.userId', 'userId')
    //   .where('board.id = :id', { id })
    //   .getOne();

    // const boardData = await getRepository(BoardEntity)
    //   .createQueryBuilder('board')
    //   .where('board.id = :id', { id: id })
    //   .getOne();

    // const boardData = await getRepository(UserEntity)
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.boards', 'boards')
    //   .where('boards.id = :id', { id: id })
    //   .getOne();
    // console.log(boardData);
  }
}
