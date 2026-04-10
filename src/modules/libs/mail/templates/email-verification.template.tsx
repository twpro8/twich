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

interface EmailVerificationTemplateProps {
  domain: string;
  token: string;
  appName: string;
}

export function EmailVerificationTemplate({
  domain,
  token,
  appName,
}: EmailVerificationTemplateProps) {
  const verificationLink = `${domain}/account/verify?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verify your email address for {appName}</Preview>
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
                Verify your email address
              </Heading>
              <Text className="text-base text-gray-500 leading-relaxed mt-0 mb-8">
                Thanks for signing up! Click the button below to confirm your
                email address and get started.
              </Text>
              <Link
                href={verificationLink}
                className="inline-block rounded-md text-sm font-medium text-white bg-[#18B9AE] px-8 py-3 no-underline"
              >
                Verify my email
              </Link>
              <Text className="text-xs text-gray-400 mt-6 mb-0">
                Button not working?{' '}
                <Link href={verificationLink} className="text-[#18B9AE] underline">
                  Copy the link
                </Link>
              </Text>
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
