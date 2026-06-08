import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlanService } from './plan.service';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';
import { CreatePlanInput } from '@/src/modules/sponsorship/plan/inputs/create_plan.input';
import { SponsorshipPlanModel } from '@/src/modules/sponsorship/plan/models/plan.model';

@Resolver('Plan')
export class PlanResolver {
  constructor(private readonly planService: PlanService) {}

  @Query(() => [SponsorshipPlanModel], { name: 'findMyPlans' })
  @Authorization()
  async findMyPlans(@Authorized() user: User) {
    return this.planService.findMyPlans(user);
  }

  @Mutation(() => Boolean, { name: 'createPlan' })
  @Authorization()
  async create(
    @Authorized() user: User,
    @Args('input') input: CreatePlanInput,
  ) {
    return this.planService.create(user, input);
  }

  @Mutation(() => Boolean, { name: 'removePlan' })
  @Authorization()
  async remove(@Args('planId') planId: string) {
    return this.planService.remove(planId);
  }
}
