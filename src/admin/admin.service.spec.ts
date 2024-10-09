import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proposal, User } from '../model';

describe('AdminService', () => {
  let service: AdminService;
  let proposalRepository: Repository<Proposal>;
  let userRepository: Repository<User>;

  const mockProposalRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockUserRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Proposal),
          useValue: mockProposalRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    proposalRepository = module.get<Repository<Proposal>>(getRepositoryToken(Proposal));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfitByStatus', () => {
    it('Retorna a soma do profit de todas as propostas por usuario agrupada por status', async () => {
      const result = [{ status: 'PENDING', totalProfit: 100 }];
      mockProposalRepository.getRawMany.mockResolvedValue(result);

      expect(await service.getProfitByStatus()).toBe(result);
      expect(await service.getProfitByStatus()).toContainEqual({
        status: 'PENDING',
        totalProfit: 100,
      });
      expect(mockProposalRepository.getRawMany).toHaveBeenCalled();
    });
  });

  describe('getBestUsers', () => {
    it('Retorna os users que possuem o maior profit de propostas em sucesso vinculado.', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const result = [
        { id: 1, fullName: 'Usuario 1', totalProposal: 200 },
        { id: 2, fullName: 'Usuario 2', totalProposal: 150 },
        { id: 3, fullName: 'Usuario 3', totalProposal: 100 },
      ];
      mockProposalRepository.getRawMany.mockResolvedValue(result);

      expect(await service.getBestUsers(start, end)).toBe(result);
      expect(await service.getBestUsers(start, end)).toMatchObject(result);
      expect(mockProposalRepository.getRawMany).toHaveBeenCalled();
    });
  });
});
