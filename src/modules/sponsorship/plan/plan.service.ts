import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { StripeService } from '@/src/modules/libs/stripe/stripe.service';
import { User } from '@prisma/generated/client';
import { CreatePlanInput } from '@/src/modules/sponsorship/plan/inputs/create_plan.input';

@Injectable()
export class PlanService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async findMyPlans(user: User) {
    return this.prismaService.sponsorshipPlan.findMany({
      where: { channelId: user.id },
    });
  }

  async create(user: User, input: CreatePlanInput) {
    const { name, price, description } = input;

    if (!user.isVerified) {
      throw new ForbiddenException('Only verified users can create plans.');
    }

    const stripePlan = await this.stripeService.plans.create({
      amount: Math.round(price * 100),
      currency: 'usd',
      interval: 'month',
      product: { name },
    });

    if (!stripePlan.product) {
      throw new InternalServerErrorException(
        'Stripe failed to create a product for this plan.',
      );
    }

    const stripeProductId =
      typeof stripePlan.product === 'string'
        ? stripePlan.product
        : stripePlan.product.id;

    await this.prismaService.sponsorshipPlan.create({
      data: {
        channelId: user.id,
        stripePlanId: stripePlan.id,
        stripeProductId: stripeProductId,
        name,
        price,
        description,
      },
    });

    return true;
  }

  async remove(planId: string) {
    const plan = await this.prismaService.sponsorshipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    await this.stripeService.plans.del(plan.stripePlanId);
    await this.stripeService.products.del(plan.stripeProductId);
    await this.prismaService.sponsorshipPlan.delete({
      where: { id: planId },
    });

    return true;
  }
}
