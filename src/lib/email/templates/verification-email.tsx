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

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

export const VerificationEmail = ({
  userName,
  verificationUrl,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address to get started</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] py-8">
            <Section className="rounded-lg bg-white p-8 shadow-sm">
              <Heading className="mb-4 text-center text-2xl font-bold text-gray-900">
                Verify Your Email
              </Heading>

              <Text className="mb-4 text-gray-700">Hi {userName},</Text>

              <Text className="mb-4 text-gray-700">
                Please verify your email address by clicking the button below.
                This link will expire in 24 hours.
              </Text>

              <Section className="mb-6 text-center">
                <Button
                  href={verificationUrl}
                  className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="mb-4 text-sm text-gray-500">
                If you didn&apos;t create an account, you can safely ignore this
                email.
              </Text>

              <Text className="text-xs text-gray-400">
                If the button doesn&apos;t work, copy and paste this URL into your
                browser:{" "}
                <span className="text-blue-600 underline">{verificationUrl}</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
