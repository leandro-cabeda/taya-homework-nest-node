import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from '../model';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
    imports: [
      TypeOrmModule.forRoot(),
      TypeOrmModule.forFeature([Proposal]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
  })
export class AdminModule {}
