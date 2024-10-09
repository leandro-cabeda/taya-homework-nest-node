import { User } from '../src/model';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
