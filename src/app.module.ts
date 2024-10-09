import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Customer, Proposal } from './model';
import { AdminModule } from './admin/admin.module';
import { ProposalModule } from './proposal/proposal.module';
import { UserModule } from './user/user.module';
import { GetUserMiddleware } from 'get-user-middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite3',
      entities: [User, Customer, Proposal],
      migrations: ['src/migrations/*.ts'],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Customer, Proposal]),
    AdminModule,
    ProposalModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetUserMiddleware).forRoutes('*');
  }
}
