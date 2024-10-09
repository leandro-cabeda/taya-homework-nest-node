import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal, User, ProposalStatus } from '../model';
import { Repository } from 'typeorm';

@Injectable()
export class ProposalService {
  constructor(
    @InjectRepository(Proposal)
    private proposalRepository: Repository<Proposal>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(proposalId: number, userId: number): Promise<Proposal> {
    try {
      const proposal = await this.proposalRepository.findOne({
        where: { id: proposalId, user: { id: userId } },
        relations: ['user'],
      });

      if (!proposal)
        throw new NotFoundException(
          `Proposta com ID ${proposalId} não encontrada para o usuário id ${userId}`,
        );

      return proposal;
    } catch (error: any) {
      console.error(error);

      if (error.status === 404)
        throw new NotFoundException(error.message, error);
      else
        throw new InternalServerErrorException('Erro ao obter os dados', error);
    }
  }

  async findPendingProposalsByUserId(userId: number): Promise<Proposal[]> {
    try {
      return this.proposalRepository.find({
        where: { user: { id: userId }, status: ProposalStatus.PENDING },
        relations: ['user'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao obter os dados', error);
    }
  }

  async findRefusedProposalsByUserId(userId: number): Promise<Proposal[]> {
    try {
      return this.proposalRepository.find({
        where: { user: { id: userId }, status: ProposalStatus.REFUSED },
        relations: ['user'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao obter os dados', error);
    }
  }

  async approveProposal(
    proposal_id: number,
    userId: number,
  ): Promise<Proposal> {
    try {
      const proposal = await this.proposalRepository.findOne({
        where: {
          id: proposal_id,
          user: { id: userId },
          status: ProposalStatus.PENDING,
        },
        relations: ['user'],
      });

      if (!proposal)
        throw new NotFoundException(
          `Proposta com ID ${proposal_id} não encontrada para o usuário id ${userId} ou não está pendente.`,
        );

      proposal.status = ProposalStatus.SUCCESSFUL;
      proposal.user.totalProposal += proposal.profit;
      await this.userRepository.save(proposal.user);
      return this.proposalRepository.save(proposal);
      
    } catch (error: any) {
      console.error(error);

      if (error.status === 404)
        throw new NotFoundException(error.message, error);
      else
        throw new InternalServerErrorException('Erro ao obter os dados', error);
    }
  }
}
