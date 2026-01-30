import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '@/emails/tailwind.config';

interface ContactReceivedProps {
  email?: string;
  subject?: string;
  siteName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ContactReceived = ({
  email,
  subject,
  siteName = process.env.NEXT_PUBLIC_SITE_NAME || '',
}: ContactReceivedProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>{siteName} | Inquiry Received</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Img
              src={`${baseUrl}/logo.png`}
              width="40"
              height="33"
              alt="Logo"
            />
            <Section>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                Thank you for contacting us.
              </Text>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                We&apos;ve received your inquiry about &quot;{subject}&quot;. Our team will get back to you soon.
              </Text>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                Best regards,<br />
                The {siteName} Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactReceived.PreviewProps = {
  email: 'user@example.com',
  subject: 'Help with pricing',
  siteName: 'Acme Corp',
} as ContactReceivedProps;

ContactReceived.tailwindConfig = tailwindConfig;

export default ContactReceived;
