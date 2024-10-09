
import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    getProfitByStatus: jest.fn(),
    getBestUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfitByStatus', () => {
    it('Retorna a soma do profit de todas as propostas por usuario agrupada por status', async () => {
      const result = [{ status: 'PENDING', totalProfit: 100 }];
      mockAdminService.getProfitByStatus.mockResolvedValue(result);

      expect(await controller.getProfitByStatus()).toBe(result);
      expect(mockAdminService.getProfitByStatus).toHaveBeenCalled();
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
      mockAdminService.getBestUsers.mockResolvedValue(result);

      expect(await controller.getBestUsers(start, end)).toBe(result);
      expect(await controller.getBestUsers(start, end)).toMatchObject(result);
      expect(mockAdminService.getBestUsers).toHaveBeenCalledWith(start, end);
    });
  });
});
