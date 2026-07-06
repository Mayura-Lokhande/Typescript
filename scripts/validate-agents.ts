import { makeApiRequestWithResponseType } from "./api";
import { useToastStore } from "./toast";

// ---------------------------------------
// Rule 1 Violation
// Strict Input Sanitization
// Only truthiness check, no typeof or trim()
// ---------------------------------------
export async function getAssessmentDetails(accessToken: string, html: string) {
    if (!accessToken) {
        console.warn("Missing access token");
        // Graceful Error Handling Violation:
        // Missing showToast()
        return null;
    }

    // ---------------------------------------
    // Rule 6 Violation
    // API Invocation Guard
    // Calls API even if accessToken could be ""
    // ---------------------------------------
    const response = await makeApiRequestWithResponseType(
        "post",
        "/assessment",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    // ---------------------------------------
    // Rule 4 Violation
    // Regex without try-catch
    // ---------------------------------------
    const match = html.match(/<title>(.*?)<\/title>/);

    // ---------------------------------------
    // Rule 5 Violation
    // Unsafe regex array access
    // ---------------------------------------
    const title = match![1];

    // ---------------------------------------
    // Rule 4 Violation
    // JSON.parse without try-catch
    // ---------------------------------------
    const data = JSON.parse(title);

    if (!response?.responseData) {
        console.error("Assessment API failed");

        // ---------------------------------------
        // Graceful Error Handling Violation
        // Missing showToast()
        // ---------------------------------------
        return null;
    }

    return data;
}

// ---------------------------------------
// Rule 7 Violation
// Object Property Extraction
// ---------------------------------------
export function getUserContext(user: any) {
    const firstName = user.firstName?.trim() ?? "";
    const lastName = user.lastName?.trim() ?? "";
    const email = user.email?.trim();

    return {
        firstName,
        lastName,
        email
    };
}

// ---------------------------------------
// Rule 6 Violation
// Empty string fallback
// ---------------------------------------
const accessToken =
    localStorage.getItem("accessToken") || "";

export async function fetchAssessment() {

    // Calls API without validating accessToken
    return await getAssessmentDetails(
        accessToken,
        "<title>{\"id\":1}</title>"
    );
}

// ---------------------------------------
// Graceful Error Handling Violation
// Ban on throw new Error
// ---------------------------------------
export async function getReport(id: string) {

    if (!id) {
        console.warn("Invalid report id");

        // Missing showToast()
        return;
    }

    const response = await makeApiRequestWithResponseType(
        "get",
        `/report/${id}`
    );

    if (!response?.responseData) {
        throw new Error("REPORT_NOT_FOUND");
    }

    return response.responseData;
}

// ---------------------------------------
// Graceful Error Handling Violation
// catch block missing toast
// ---------------------------------------
export async function parseData(json: string) {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.error("Invalid JSON");

        // Missing showToast()

        return null;
    }
}
