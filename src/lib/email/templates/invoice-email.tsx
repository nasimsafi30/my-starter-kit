import {
  Body, Button, Container, Head, Heading, Html, Preview,
  Section, Text, Tailwind, Row, Column, Hr,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  userName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  items: Array<{ description: string; quantity: number; price: number }>;
  downloadUrl: string;
}

export const InvoiceEmail = ({
  userName, invoiceNumber, amount, currency, dueDate, items, downloadUrl,
}: InvoiceEmailProps) => {
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const previewText = "Invoice " + invoiceNumber + " - " + currency + " " + String(amount);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl py-8">
            <Section className="rounded-lg bg-white p-8 shadow-sm">
              <Heading className="mb-4 text-2xl font-bold text-gray-900">
                Invoice {invoiceNumber}
              </Heading>
              <Text className="mb-4 text-gray-700">Dear {userName},</Text>
              <Text className="mb-4 text-gray-700">Please find your invoice details below:</Text>
              <Section className="mb-6 rounded-lg bg-gray-50 p-4">
                <Row className="border-b border-gray-200 py-2">
                  <Column className="font-semibold">Description</Column>
                  <Column className="text-right font-semibold">Qty</Column>
                  <Column className="text-right font-semibold">Price</Column>
                  <Column className="text-right font-semibold">Total</Column>
                </Row>
                {items.map((item, index) => (
                  <Row key={index} className="border-b border-gray-100 py-2">
                    <Column>{item.description}</Column>
                    <Column className="text-right">{item.quantity}</Column>
                    <Column className="text-right">{currency} {item.price}</Column>
                    <Column className="text-right">{currency} {item.quantity * item.price}</Column>
                  </Row>
                ))}
                <Row className="py-2">
                  <Column className="font-semibold">Total</Column>
                  <Column></Column>
                  <Column></Column>
                  <Column className="text-right font-semibold">{currency} {total}</Column>
                </Row>
              </Section>
              <Row className="mb-6">
                <Column><Text className="text-sm text-gray-600"><strong>Due Date:</strong> {dueDate}</Text></Column>
                <Column className="text-right">
                  <Button href={downloadUrl} className="rounded-md bg-green-600 px-4 py-2 text-sm text-white">Download Invoice</Button>
                </Column>
              </Row>
              <Hr className="my-6 border-gray-200" />
              <Text className="text-sm text-gray-500">Thank you for your business!</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvoiceEmail;