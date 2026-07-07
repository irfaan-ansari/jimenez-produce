import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SID;

const messagingServiceId = process.env.TWILIO_MESSAGING_SID;

export const twilioClient = twilio(accountSid, authToken);

export const twilioSendOTP = async ({
  phoneNumber,
}: {
  phoneNumber: string;
}) => {
  try {
    return await twilioClient.verify.v2
      .services(serviceId!)
      .verifications.create({
        to: `+1${phoneNumber}`,
        channel: "sms",
      });
  } catch (error) {
    throw new Error("Failed to send otp, try again.");
  }
};

export const twilioVerifyOTP = async ({
  phoneNumber,
  code,
}: {
  phoneNumber: string;
  code: string;
}) => {
  try {
    return await twilioClient.verify.v2
      .services(serviceId!)
      .verificationChecks.create({
        to: `+1${phoneNumber}`,
        code,
      });
  } catch (error) {
    throw new Error("Failed to verify otp, try again.");
  }
};

export const twilioSendMessage = async ({
  phoneNumber,
  body,
}: {
  phoneNumber: string;
  body: string;
}) => {
  return twilioClient.messages.create({
    messagingServiceSid: messagingServiceId,
    to: `+1${phoneNumber}`,
    body,
  });
};
