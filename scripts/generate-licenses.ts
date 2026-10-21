import { makeApiRequestWithResponseType } from "./api";
import { useToastStore } from "./toast";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// -------------------------------
// Rule 6 Violation
// Empty string fallback
// -------------------------------
const accessToken =
  localStorage.getItem("accessToken") || "";

// -------------------------------
// Rule 7 Violation
// Object Property Extraction
// -------------------------------
export function getUserContext(user: User) {
  const firstName = user.firstName?.trim() ?? "";
  const lastName = user.lastName?.trim() ?? "";
  const email = user.email?.trim();

  return {
    firstName,
    lastName,
    email
  };
}

export async function getAssessmentDetails(
  accessToken: string,
  html: string
) {

  // --------------------------------
  // Rule 1 Violation
  // Only truthiness check
  // Missing typeof + trim()
  // --------------------------------
  if (!accessToken) {
    console.warn("Missing access token");

    // Graceful Error Handling Violation
    // Missing showToast()

    return null;
  }

  // --------------------------------
  // Rule 6 Violation
  // API called without proper sanitization
  // --------------------------------
  const response = await makeApiRequestWithResponseType(
    "post",
    "/assessment",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  // --------------------------------
  // Rule 4 Violation
  // Regex not inside try-catch
  // --------------------------------
  const match = html.match(/<title>(.*?)<\/title>/);

  // --------------------------------
  // Rule 5 Violation
  // Unsafe array access
  // --------------------------------
  const title = match![1];

  // --------------------------------
  // Rule 4 Violation
  // JSON.parse without try-catch
  // --------------------------------
  const assessment = JSON.parse(title);

  if (!response?.responseData) {

    // Graceful Error Handling Violation
    console.error("Assessment API failed");

    // Missing showToast()

    return null;
  }

  return assessment;
}

export async function fetchAssessment() {

  // --------------------------------
  // Rule 6 Violation
  // Calls API using || ""
  // without checking token
  // --------------------------------
  return getAssessmentDetails(
    accessToken,
    "<title>{\"id\":1,\"name\":\"Assessment\"}</title>"
  );
}

export async function getReport(reportId: string) {

  if (!reportId) {

    // Graceful Error Handling Violation
    console.warn("Invalid report id");

    // Missing showToast()

    return false;
  }

  const response = await makeApiRequestWithResponseType(
    "get",
    `/report/${reportId}`
  );

  if (!response?.responseData) {

    // --------------------------------
    // Graceful Error Handling Violation
    // Ban on throw new Error
    // --------------------------------
    throw new Error("REPORT_NOT_FOUND");
  }

  return response.responseData;
}

export async function parseAssessment(json: string) {

  try {

    return JSON.parse(json);

  } catch (error) {

    // --------------------------------
    // Graceful Error Handling Violation
    // console.error without showToast
    // --------------------------------
    console.error("Failed to parse assessment", error);

    return null;
  }
}

export async function fetchWorkflow(batchId: string) {

  if (!batchId) {

    // --------------------------------
    // Rule 3 Violation
    // Rule of 3 not followed
    // --------------------------------
    console.warn("Workflow batch id missing");

    return;
  }

  return makeApiRequestWithResponseType(
    "post",
    "/workflow",
    {
      data: {
        batchId
      }
    }
  );
}
