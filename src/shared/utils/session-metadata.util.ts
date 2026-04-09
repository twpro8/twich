import type { Request } from 'express';
import type { SessionMetadata } from '../types/session-metadata.types';
import DeviceDetector = require('device-detector-js');
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';
import { IS_DEV_ENV } from './is-dev.util';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export function getSessionMetadata(req: Request, userAgent: string): SessionMetadata {
  const ip = extractIp(req);
  const device = new DeviceDetector().parse(userAgent);
  const location = lookup(ip);

  return {
    location: {
      country: countries.getName(location?.country || '', 'en') || '',
      city: location?.city || '',
      latitude: location?.ll[0] || 0,
      longitude: location?.ll[1] || 0,
    },
    device: {
      browser: device.client?.name || '',
      os: device.os?.name || '',
      type: device.device?.type || '',
    },
    ip,
  }
}

function extractIp(req: Request): string {
  if (IS_DEV_ENV) return '211.23.45.67';

  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp) return Array.isArray(cfIp) ? cfIp[0] : cfIp;

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();

  return req.ip ?? '0.0.0.0';
}
