import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IngressService } from './ingress.service';
import { Authorization } from '@/src/shared/decorators/auth.decorator';
import { Authorized } from '@/src/shared/decorators/authorized.decorator';
import type { User } from '@prisma/generated/client';
import type { IngressInput } from 'livekit-server-sdk';

@Resolver('Ingress')
export class IngressResolver {
  constructor(private readonly ingressService: IngressService) {}

  @Authorization()
  @Mutation(() => Boolean)
  async createIngress(
    @Authorized() user: User,
    @Args('ingressType') ingressType: IngressInput,
  ) {
    return this.ingressService.createIngress(user, ingressType);
  }
}
