import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  userName,
  resetUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] py-8">
            <Section className="rounded-lg bg-white p-8 shadow-sm">
              <Heading className="mb-4 text-center text-2xl font-bold text-gray-900">
                Reset Your Password
              </Heading>

              <Text className="mb-4 text-gray-700">Hi {userName},</Text>

              <Text className="mb-4 text-gray-700">
                We received a request to reset your password. Click the button
                below to create a new password. This link will expire in 1 hour.
              </Text>

              <Section className="mb-6 text-center">
                <Button
                  href={resetUrl}
                  className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="mb-4 text-sm text-gray-500">
                If you didn&apos;t request a password reset, you can safely ignore
                this email. Your password will remain unchanged.
              </Text>

              <Text className="text-xs text-gray-400">
                Link: {resetUrl}
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Text className="text-xs text-gray-400">
                © {new Date().getFullYear()} StarterKit. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
