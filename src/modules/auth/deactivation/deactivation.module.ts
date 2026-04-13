import { Module } from '@nestjs/common';
import { DeactivationResolver } from './deactivation.resolver';
import { DeactivationService } from './deactivation.service';

@Module({
  providers: [DeactivationResolver, DeactivationService],
})
export class DeactivationModule {}
