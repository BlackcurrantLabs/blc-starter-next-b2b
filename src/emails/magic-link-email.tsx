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

interface MagicLinkEmailProps {
  link?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const MagicLinkEmail = ({
  link,
}: MagicLinkEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>{process.env.NEXT_PUBLIC_SITE_NAME || ""} | login with magic link</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Img
              src={`${baseUrl}/logo.png`}
              width="40"
              height="33"
              alt="Multitude"
            />
            <Section>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                Hi,
              </Text>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                If you requested to login with magic link for your {process.env.NEXT_PUBLIC_SITE_NAME}
                account. Click here to login:
              </Text>
              <Button
                className="bg-[#63a401] rounded text-white text-[15px] no-underline text-center font-dropbox-sans block w-[210px] py-[14px] px-[7px]"
                href={link}
              >
                Login
              </Button>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                If you don&apos;t want to login or didn&apos;t
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

MagicLinkEmail.PreviewProps = {
  link: 'https://example.com',
} as MagicLinkEmailProps;

MagicLinkEmail.tailwindConfig = tailwindConfig;

export default MagicLinkEmail;