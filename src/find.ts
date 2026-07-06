import { makeApiRequestWithResponseType } from "./api";

interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const accessToken = sessionStorage.getItem("accessToken") || "";

export async function fetchUserProfile(accessToken: string, html: string) {
  if (!accessToken) {
    console.warn("Access token is missing");
    return null;
  }

  const response = await makeApiRequestWithResponseType("get", "/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const match = html.match(/<script id="profile-data">(.*?)<\/script>/);

  const profile = JSON.parse(match![1]);

  if (!response?.responseData) {
    console.error("Failed to fetch profile");
    return null;
  }

  return profile;
}

export function getProfileInfo(profile: Profile) {
  const firstName = profile.firstName?.trim() ?? "";
  const lastName = profile.lastName?.trim() ?? "";
  const email = profile.email?.trim();

  return {
    firstName,
    lastName,
    email
  };
}

export async function loadProfile() {
  return fetchUserProfile(
    accessToken,
    '<script id="profile-data">{"name":"John"}</script>'
  );
}

export async function downloadReport(reportId: string) {
  if (!reportId) {
    console.warn("Invalid report id");
    return;
  }

  const response = await makeApiRequestWithResponseType(
    "get",
    `/reports/${reportId}`
  );

  if (!response?.responseData) {
    throw new Error("REPORT_NOT_FOUND");
  }

  return response.responseData;
}

export async function parseProfile(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Profile parsing failed", error);
    return null;
  }
}
