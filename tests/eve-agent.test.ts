import { makeApiRequestWithResponseType } from "./api";

export const getAssessmentDetails = async (
  accessToken: string,
  html: string
) => {

  // Rule 1 violation:
  // Only checks truthiness, no typeof or trim.
  if (!accessToken) {
    console.warn("Missing access token");
  }

  // Rule 2 violation:
  // No early return after invalid input.

  // Rule 6 violation:
  // API is still called even when token may be empty.
  const response = await makeApiRequestWithResponseType(
    "post",
    "/assessment",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  // Rule 4 violation:
  // Risky regex operation without try/catch.
  const match = html.match(/<title>(.*?)<\/title>/);

  // Rule 5 violation:
  // Accessing array element without checking length.
  const title = match![1];

  // Rule 4 violation:
  // String replacement without protection.
  let escaped = "";
  try {
    escaped = title.replace(/</g, "&lt;");
  } catch (error) {
    console.error("String replacement failed", error);
    return null;
  }

  const data = JSON.parse(escaped);

  return response.responseData;
};
