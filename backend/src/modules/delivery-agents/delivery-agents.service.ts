import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryAgent } from './delivery-agent.entity';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class DeliveryAgentsService {
  constructor(
    @InjectRepository(DeliveryAgent)
    private readonly agentRepo: Repository<DeliveryAgent>,
  ) {}

  findAll(): Promise<DeliveryAgent[]> {
    return this.agentRepo.find({ order: { name: 'ASC' } });
  }

  create(dto: CreateAgentDto): Promise<DeliveryAgent> {
    const agent = this.agentRepo.create({
      name: dto.name,
      phone: dto.phone,
      notes: dto.notes ?? null,
      email: dto.email ?? null,
    });
    return this.agentRepo.save(agent);
  }

  async update(id: string, dto: UpdateAgentDto): Promise<DeliveryAgent> {
    const agent = await this.agentRepo.findOne({ where: { id } });
    if (!agent) throw new NotFoundException('Agent not found');
    Object.assign(agent, dto);
    return this.agentRepo.save(agent);
  }
}
