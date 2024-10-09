import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './src/user/user.service';

@Injectable()
export class GetUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['user_id'];

    if (!userId)
      return res.status(401).json({ message: 'Usuario ID é obrigatório!' });

    try {
      const user = await this.userService.findById(Number(userId));

      if (!user) 
        return res.status(404).json({ message: 'Usuario não encontrado' });
      

      req.user = user; 
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
