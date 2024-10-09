import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from '../model';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
  ) {}

  async getProfitByStatus() {
    try {
      const result = await this.proposalRepository
        .createQueryBuilder('proposal')
        .select('proposal.status', 'status')
        .addSelect('SUM(proposal.profit)', 'totalProfit')
        .groupBy('proposal.status')
        .getRawMany();

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao obter os dados', error);
    }
  }

  async getBestUsers(start: string, end: string) {
    try {
      const result = await this.proposalRepository
        .createQueryBuilder('proposal')
        .select('user.id', 'id')
        .addSelect('user.fullName', 'fullName')
        .addSelect('SUM(proposal.profit)', 'totalProposal')
        .innerJoin('proposal.user', 'user')
        .where('proposal.status = :status', { status: 'SUCCESSFUL' })
        .andWhere('proposal.createdAt BETWEEN :start AND :end', { start, end })
        .groupBy('user.id')
        .orderBy('totalProposal', 'DESC')
        .getRawMany();

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao obter os dados', error);
    }
  }
}
