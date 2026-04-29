import twilio from "twilio";

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export const twilioSendOTP = async ({
  phoneNumber,
  code,
}: {
  phoneNumber: string;
  code: string;
}) => {
  return await twilioClient.messages.create({
    body: `Your verification code is ${code}. Do not share this code with anyone.
    - Jimenez Produce`,
    // to: phoneNumber,
    to: "+919958367688",
    from: process.env.TWILIO_FROM_PHONE!,
  });
};
