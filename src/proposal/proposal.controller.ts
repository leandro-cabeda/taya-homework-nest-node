import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { Request } from 'express';
import { Proposal } from '../model';
import { GetUserMiddleware } from 'get-user-middleware';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('proposals')
@UseGuards(GetUserMiddleware)
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Corrigir a API para retornar a proposta apenas se pertencer ao user que está chamando.' })
  @ApiResponse({ status: 200, description: 'Retorna proposta referente o usuario' })
  @ApiParam({ name: 'id', required: true, type: Number })
  async getProposal(@Req() req: Request, @Param('id') id: number): Promise<Proposal> {
    const userId = req.user.id;
    return this.proposalService.findById(id, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna lista de propostas pendentes de um user..' })
  @ApiResponse({ status: 200, description: 'Retorna lista de propostas pendentes' })
  async getPendingProposalsByUserId(@Req() req: Request): Promise<Proposal[]> {
    const userId = req.user.id;
    return this.proposalService.findPendingProposalsByUserId(userId);
  }

  @Get('refused')
  @ApiOperation({ summary: 'Retorna propostas rejeitadas criadas por um user' })
  @ApiResponse({ status: 200, description: 'Retorna lista de propostas rejeitadas' })
  async getRefusedProposalsByUserId(@Req() req: Request): Promise<Proposal[]> {
    const userId = req.user.id;
    return this.proposalService.findRefusedProposalsByUserId(userId);
  }

  @Post(':proposal_id/approve')
  @ApiOperation({ summary: 'Retorna a proposta atualizada pelo user' })
  @ApiResponse({ status: 200, description: 'Retorna a proposta atualizada' })
  @ApiParam({ name: 'proposal_id', required: true, type: Number })
  async approveProposal(@Req() req: Request, @Param('proposal_id') proposal_id: number): Promise<Proposal> {
    const userId = req.user.id;
    return this.proposalService.approveProposal(userId, proposal_id);
  }
}
