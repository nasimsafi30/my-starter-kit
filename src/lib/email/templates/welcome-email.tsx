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
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userName: string;
  verificationUrl?: string;
}

export const WelcomeEmail = ({ userName, verificationUrl }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to StarterKit! Get started with your account.</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] py-8">
            <Section className="rounded-lg bg-white p-8 shadow-sm">
              <Heading className="mb-4 text-center text-2xl font-bold text-gray-900">
                Welcome to StarterKit! 🎉
              </Heading>

              <Text className="mb-4 text-gray-700">Hi {userName},</Text>

              <Text className="mb-4 text-gray-700">
                Thank you for joining StarterKit! We&apos;re excited to have you on
                board. Get started by exploring your dashboard and setting up your
                profile.
              </Text>

              {verificationUrl && (
                <Section className="mb-6 text-center">
                  <Button
                    href={verificationUrl}
                    className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white"
                  >
                    Verify Your Email
                  </Button>
                </Section>
              )}

              <Section className="mb-6">
                <Text className="font-semibold text-gray-900">
                  Here&apos;s what you can do next:
                </Text>
                <Text className="text-sm text-gray-600">✅ Complete your profile</Text>
                <Text className="text-sm text-gray-600">✅ Explore the dashboard</Text>
                <Text className="text-sm text-gray-600">✅ Set up notifications</Text>
                <Text className="text-sm text-gray-600">✅ Invite your team</Text>
              </Section>

              <Hr className="my-6 border-gray-200" />

              <Text className="text-sm text-gray-500">
                Need help? Contact our support team or visit our{" "}
                <Link href="/help" className="text-blue-600 underline">
                  help center
                </Link>
                .
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

export default WelcomeEmail;
