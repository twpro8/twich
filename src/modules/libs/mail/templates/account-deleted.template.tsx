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

interface AccountDeletedTemplateProps {
  domain: string;
  appName: string;
}

export function AccountDeletedTemplate({
  domain,
  appName,
}: AccountDeletedTemplateProps) {
  const registerLink = `${domain}/account/create`;

  return (
    <Html>
      <Head />
      <Preview>Your {appName} account has been deleted</Preview>
      <Tailwind>
        <Body className="bg-slate-50">
          <Container className="max-w-lg mx-auto">

            {/* Header */}
            <Section className="bg-red-500 rounded-t-lg px-6 py-4 text-center">
              <Text className="text-white font-medium text-sm tracking-wide m-0">
                {appName}
              </Text>
            </Section>

            {/* Main content */}
            <Section className="bg-white px-8 py-10 text-center">
              <Heading className="text-2xl font-medium text-gray-900 mt-0 mb-3">
                Your account has been deleted
              </Heading>
              <Text className="text-base text-gray-500 leading-relaxed mt-0 mb-8">
                Your {appName} account and all associated data have been
                permanently deleted. We're sorry to see you go.
              </Text>
              <Text className="text-base text-gray-500 leading-relaxed mt-0 mb-8">
                If you ever change your mind, you're always welcome to create
                a new account.
              </Text>
              <Link
                href={registerLink}
                className="inline-block rounded-md text-sm font-medium text-white bg-red-500 px-8 py-3 no-underline"
              >
                Create a new account
              </Link>
            </Section>

            {/* Footer */}
            <Hr className="border-gray-200 my-0" />
            <Section className="bg-white rounded-b-lg px-8 py-5 text-center">
              <Text className="text-sm text-gray-500 m-0">
                Having trouble?{' '}
                <Link
                  href="mailto:support@yourapp.com"
                  className="text-red-500 underline"
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
