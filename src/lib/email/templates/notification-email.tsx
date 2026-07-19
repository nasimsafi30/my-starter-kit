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
  Hr,
} from "@react-email/components";
import * as React from "react";

interface NotificationEmailProps {
  userName: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
}

export const NotificationEmail = ({
  userName,
  title,
  message,
  actionUrl,
  actionLabel,
}: NotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-[600px] py-8">
            <Section className="rounded-lg bg-white p-8 shadow-sm">
              <Heading className="mb-4 text-2xl font-bold text-gray-900">
                {title}
              </Heading>

              <Text className="mb-4 text-gray-700">Hi {userName},</Text>

              <Text className="mb-4 text-gray-700">{message}</Text>

              {actionUrl && actionLabel && (
                <Section className="mb-6 text-center">
                  <Button
                    href={actionUrl}
                    className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white"
                  >
                    {actionLabel}
                  </Button>
                </Section>
              )}

              <Hr className="my-6 border-gray-200" />

              <Text className="text-sm text-gray-500">
                You received this email because you have notifications enabled.
                You can manage your notification preferences in your account
                settings.
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

export default NotificationEmail;
