import { Module } from '@nestjs/common';
import { DeactivationService } from './deactivation.service';
import { DeactivationResolver } from './deactivation.resolver';

@Module({
  providers: [DeactivationResolver, DeactivationService],
})
export class DeactivationModule {}
