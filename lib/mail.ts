import type { ApplicationStatus } from "@/lib/types";

type StatusMail = {
  subject: string;
  greeting: string;
  heading: string;
  content: string;
  senderName: string;
  senderRole: string;
};

const MAIL_API_URL =
  "https://sso.awslpu.in/api/v1/mail/send";

const SENDER_NAME = "AWS Student Builder Group";
const SENDER_ROLE = "Recruitment Team";

function getStatusMail(
  name: string,
  status: ApplicationStatus
): StatusMail {
  switch (status) {
    case "Pending":
      return {
        subject:
          "AWS LPU Recruitment - Application Update",
        greeting: `Dear ${name},`,
        heading: "Application Update",
        content:
          "Your AWS LPU recruitment application is currently under review.\n\nWe will share further updates as the recruitment process progresses.\n\nPlease visit https://recruitment.awslpu.in for more information.",
        senderName: SENDER_NAME,
        senderRole: SENDER_ROLE,
      };

    case "Shortlisted":
      return {
        subject:
          "AWS LPU Recruitment - Application Shortlisted",
        greeting: `Dear ${name},`,
        heading: "Application Shortlisted",
        content:
          "We are pleased to inform you that your application has been shortlisted for the next stage of the AWS LPU recruitment process.\n\nFurther details regarding the next stage will be shared with you shortly.\n\nPlease visit https://recruitment.awslpu.in for more information.",
        senderName: SENDER_NAME,
        senderRole: SENDER_ROLE,
      };

    case "Interview Scheduled":
      return {
        subject:
          "AWS LPU Recruitment - Interview Scheduled",
        greeting: `Dear ${name},`,
        heading: "Interview Scheduled",
        content:
          "Your AWS LPU recruitment application has progressed to the interview stage.\n\nFurther details regarding your interview will be shared with you shortly.\n\nPlease visit https://recruitment.awslpu.in for more information.",
        senderName: SENDER_NAME,
        senderRole: SENDER_ROLE,
      };

    case "Selected":
      return {
        subject:
          "AWS LPU Recruitment - Selection Update",
        greeting: `Dear ${name},`,
        heading: "Application Selected",
        content:
          "Congratulations! We are pleased to inform you that you have been selected through the AWS LPU recruitment process.\n\nFurther details and next steps will be shared with you shortly.\n\nPlease visit https://recruitment.awslpu.in for more information.",
        senderName: SENDER_NAME,
        senderRole: SENDER_ROLE,
      };

    case "Rejected":
      return {
        subject:
          "AWS LPU Recruitment - Application Update",
        greeting: `Dear ${name},`,
        heading: "Application Update",
        content:
          "Thank you for your interest in the AWS LPU recruitment process and for taking the time to apply.\n\nAfter reviewing your application, we will not be progressing with it at this stage. We appreciate your effort and encourage you to stay connected with the AWS LPU community for future opportunities.\n\nPlease visit https://recruitment.awslpu.in for more information.",
        senderName: SENDER_NAME,
        senderRole: SENDER_ROLE,
      };
    
    case "Accepted Offer":
      return {
        subject:
          "AWS LPU Recruitment - Offer Accepted",
        greeting: `Dear ${name},`,
        heading: "Offer Accepted",
        content:
          "Congratulations! We are pleased to inform you that you have accepted the offer for the position at AWS LPU.\n\nPlease find the attached offer letter for your reference.\n\nPlease visit https://recruitment.awslpu.in for more information.",
        senderName: SENDER_NAME,
        senderRole: SENDER_ROLE,
      };
  }
}

async function sendMail(
  to: string,
  mail: Omit<StatusMail, "greeting"> & {
    greeting?: string;
  }
) {
  const apiKey = process.env.AWS_LPU_MAIL_API_KEY;

  if (!apiKey) {
    throw new Error(
      "AWS_LPU_MAIL_API_KEY is not configured"
    );
  }

  const response = await fetch(MAIL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      ...mail,
    }),
  });

  let data: {
    success?: boolean;
    message?: string;
  };

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "Failed to send email"
    );
  }

  return data;
}

export async function sendApplicationStatusMail({
  to,
  name,
  status,
}: {
  to: string;
  name: string;
  status: ApplicationStatus;
}) {
  const mail = getStatusMail(name, status);

  return sendMail(to, mail);
}