import { ApolloDriverConfig } from '@nestjs/apollo';
import type { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { join } from 'path';

import { GqlContext } from '@/src/shared/types/gql-context.types';
import { isDev } from '@/src/shared/utils/is-dev.util';

export function getGraphQLConfig(
  configService: ConfigService,
): ApolloDriverConfig {
  return {
    playground: isDev(configService),
    path: configService.getOrThrow<string>('GRAPHQL_PREFIX'),
    autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
    sortSchema: true,
    context: ({ req, res }: { req: Request; res: Response }): GqlContext => ({
      req,
      res,
    }),
  };
}
