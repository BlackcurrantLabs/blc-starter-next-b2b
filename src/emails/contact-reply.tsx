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
  Hr,
} from '@react-email/components';
import tailwindConfig from '@/emails/tailwind.config';

interface ContactReplyProps {
  originalSubject?: string;
  replyMessage?: string;
  siteName?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ContactReply = ({
  originalSubject,
  replyMessage,
  siteName = process.env.NEXT_PUBLIC_SITE_NAME || '',
}: ContactReplyProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>Re: {originalSubject || "Inquiry"}</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Img
              src={`${baseUrl}/logo.png`}
              width="40"
              height="33"
              alt="Logo"
            />
            <Section>
              <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px] whitespace-pre-wrap">
                {replyMessage}
              </Text>
              <Hr className="border-gray-300 my-6" />
              <Text className="text-sm font-dropbox font-light text-[#808080] leading-[20px]">
                You are receiving this email in response to your inquiry regarding &quot;{originalSubject}&quot;.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactReply.PreviewProps = {
  originalSubject: 'Pricing Question',
  replyMessage: 'Hello,\n\nThanks for asking about our pricing. Here are the details...',
  siteName: 'Acme Corp',
} as ContactReplyProps;

ContactReply.tailwindConfig = tailwindConfig;

export default ContactReply;
