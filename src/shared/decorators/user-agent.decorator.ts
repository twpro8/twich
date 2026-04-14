import type { Request } from 'express';

import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { GqlContext } from '@/src/shared/types/gql-context.types';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest<Request>();
      return req.headers['user-agent'] ?? '';
    } else {
      const context = GqlExecutionContext.create(ctx);
      return context.getContext<GqlContext>().req.headers['user-agent'] ?? '';
    }
  },
);
