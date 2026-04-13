import type {
  DeviceInfo,
  LocationInfo,
  SessionMetadata,
} from '@/src/shared/types/session-metadata.types';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationModel implements LocationInfo {
  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  latitude: number;

  @Field()
  longitude: number;
}

@ObjectType()
export class DeviceModel implements DeviceInfo {
  @Field()
  browser: string;

  @Field()
  os: string;

  @Field()
  type: string;
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
  @Field()
  location: LocationModel;

  @Field()
  device: DeviceModel;

  @Field()
  ip: string;
}

@ObjectType()
export class SessionModel {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  createdAt: string;

  @Field()
  metadata: SessionMetadataModel;
}
