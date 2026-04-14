import { PrismaService } from '@/src/core/prisma/prisma.service';
import { GqlContext } from '@/src/shared/types/gql-context.types';
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<GqlContext>().req;

    if (typeof req.session.userId === 'undefined') {
      throw new UnauthorizedException();
    }

    req.user = await this.prismaService.user.findUnique({
      where: { id: req.session.userId },
    });

    return true;
  }
}
