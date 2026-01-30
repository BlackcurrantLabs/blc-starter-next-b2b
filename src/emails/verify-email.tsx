import {
  Body,
  Button,
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

interface VerifyEmailProps {
  name?: string;
  link?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const VerifyEmail = ({
  name,
  link,
}: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>{process.env.NEXT_PUBLIC_SITE_NAME || ""} | verify your email</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Img
              src={`${baseUrl}/logo.png`}
              width="40"
              height="33"
              alt="Logo"
            />
            <Section>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                Hi {name},
              </Text>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                Someone recently requested email verification for your {process.env.NEXT_PUBLIC_SITE_NAME}
                account. If this was you, you can verify your email here:
              </Text>
              <Button
                className="bg-[#63a401] rounded text-white text-[15px] no-underline text-center font-dropbox-sans block w-[210px] py-[14px] px-[7px]"
                href={link}
              >
                Verify Email
              </Button>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                If you don&apos;t want to verify your email or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

VerifyEmail.PreviewProps = {
  name: 'Alan',
  link: 'https://example.com',
} as VerifyEmailProps;

VerifyEmail.tailwindConfig = tailwindConfig;

export default VerifyEmail;