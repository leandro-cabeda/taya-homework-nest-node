import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
@ApiTags('user')
export class User {

  @ApiProperty({
    example: 1,
    description: 'Identificador do usuário',
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Joaquim',
    description: 'Nome do usuário',
    type: String,
  })
  @Column()
  fullName: string;

  @ApiProperty({
    example: 0,
    description: 'Saldo do usuário',
    type: Number,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalProposal: number;

  @ApiProperty({
    example: 'P3KpI@example.com',
    description: 'Email do usuário',
    type: String,
  })
  @Column({ unique: true })
  email: string;

  @OneToMany(() => Customer, (customer) => customer.user)
  customers: Customer[];

  @OneToMany(() => Proposal, (proposal) => proposal.user)
  proposals: Proposal[];
}

@Entity()
@ApiTags('customer')
export class Customer {

  @ApiProperty({
    example: 1,
    description: 'Identificador do cliente',
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Joaquim',
    description: 'Nome do cliente',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 0,
    description: 'Saldo do cliente',
    type: Number,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, (user) => user.customers)
  user: User;

  @OneToMany(() => Proposal, (proposal) => proposal.customer)
  proposals: Proposal[];
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  REFUSED = 'REFUSED',
  ERROR = 'ERROR',
  SUCCESSFUL = 'SUCCESSFUL',
}

@Entity()
@ApiTags('proposal')
export class Proposal {

  @ApiProperty({
    example: 1,
    description: 'Identificador da proposta',
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 0,
    description: 'Lucro da proposta',
    type: Number,
  })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  profit: number;

  @ApiProperty({
    example: 'PENDING',
    description: 'Status da proposta',
    type: String,
  })
  @Column({ type: 'text', enum: ProposalStatus, default: ProposalStatus.PENDING })
  status: ProposalStatus;

  @ManyToOne(() => User, (user) => user.proposals)
  user: User;

  @ManyToOne(() => Customer, (customer) => customer.proposals)
  customer: Customer;
}

