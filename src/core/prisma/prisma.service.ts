import { PrismaClient } from '@prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { 
  Injectable, 
  type OnModuleDestroy, 
  type OnModuleInit 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService 
  extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy 
{
  constructor(private readonly configService: ConfigService) {
    const adapter = new PrismaPg({ 
      connectionString: configService.getOrThrow<string>('POSTGRES_URI') 
    });
    super({ adapter });
  }

  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}