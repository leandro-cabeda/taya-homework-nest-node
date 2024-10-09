import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal, User } from '../model';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Proposal, User]),
      ],
      controllers: [ProposalController],
      providers: [ProposalService],
      exports: [ProposalService],
})
export class ProposalModule {}
