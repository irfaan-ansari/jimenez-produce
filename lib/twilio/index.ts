import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SID;

export const twilioClient = twilio(accountSid, authToken);

export const twilioSendOTP = async ({
  phoneNumber,
}: {
  phoneNumber: string;
}) => {
  return await twilioClient.verify.v2
    .services(serviceId!)
    .verifications.create({
      to: `+1${phoneNumber}`,
      channel: "sms",
    });
};

export const twilioVerifyOTP = async ({
  phoneNumber,
  code,
}: {
  phoneNumber: string;
  code: string;
}) => {
  return await twilioClient.verify.v2
    .services(serviceId!)
    .verificationChecks.create({
      to: `+1${phoneNumber}`,
      code,
    });
};
