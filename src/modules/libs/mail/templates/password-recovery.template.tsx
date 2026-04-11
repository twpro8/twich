import * as React from 'react';
import { Html } from '@react-email/html';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

interface PasswordRecoveryTemplateProps {
  domain: string;
  token: string;
  appName: string;
  metadata: SessionMetadata;
}

export function PasswordRecoveryTemplate({
  domain,
  token,
  appName,
  metadata,
}: PasswordRecoveryTemplateProps) {
  const resetLink = `${domain}/account/recovery?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Reset your {appName} password</Preview>
      <Tailwind>
        <Body className="bg-slate-50">
          <Container className="max-w-lg mx-auto">

            {/* Header */}
            <Section className="bg-[#18B9AE] rounded-t-lg px-6 py-4 text-center">
              <Text className="text-white font-medium text-sm tracking-wide m-0">
                {appName}
              </Text>
            </Section>

            {/* Main content */}
            <Section className="bg-white px-8 py-10 text-center">
              <Heading className="text-2xl font-medium text-gray-900 mt-0 mb-3">
                Reset your password
              </Heading>
              <Text className="text-base text-gray-500 leading-relaxed mt-0 mb-8">
                We received a request to reset your password. Click the button
                below to choose a new one. This link expires in 30 minutes.
              </Text>
              <Link
                href={resetLink}
                className="inline-block rounded-md text-sm font-medium text-white bg-[#18B9AE] px-8 py-3 no-underline"
              >
                Reset password
              </Link>
              <Text className="text-xs text-gray-400 mt-6 mb-1">
                Didn't request this? You can safely ignore this email.
              </Text>
              <Text className="text-xs text-gray-400 mt-0 mb-0">
                Button not working?{' '}
                <Link href={resetLink} className="text-[#18B9AE] underline">
                  Copy the link
                </Link>
              </Text>
            </Section>

            {/* Request metadata */}
            <Section className="bg-white px-8 pb-6">
              <Hr className="border-gray-100 mt-0 mb-5" />
              <Text className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-0 mb-3">
                Request details
              </Text>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="text-gray-400 py-1">Location</td>
                    <td className="text-gray-600 text-right py-1">
                      {metadata.location.country}, {metadata.location.city}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 py-1">Operating system</td>
                    <td className="text-gray-600 text-right py-1">
                      {metadata.device.os}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 py-1">Browser</td>
                    <td className="text-gray-600 text-right py-1">
                      {metadata.device.browser}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-400 py-1">IP address</td>
                    <td className="text-gray-600 text-right py-1">
                      {metadata.ip}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Footer */}
            <Hr className="border-gray-200 my-0" />
            <Section className="bg-white rounded-b-lg px-8 py-5 text-center">
              <Text className="text-sm text-gray-500 m-0">
                Having trouble?{' '}
                <Link
                  href="mailto:support@yourapp.com"
                  className="text-[#18B9AE] underline"
                >
                  Contact support
                </Link>
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}