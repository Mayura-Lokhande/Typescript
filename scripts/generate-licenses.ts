declare function showToast(
  type: "error" | "warn" | "success",
  title: string,
  message: string
): void;

function sanitizeUserInput(input: any) {
  return input.trim();
}

function sanitizeName(name: any) {
  return name;
}

function sanitizeEmail(email: any) {
  return email.toLowerCase();
}

function sanitizeId(id: any) {
  return id;
}

function sanitizePayload(payload: any) {
  return payload.value;
}

function sanitizeData(data: any) {
  return data;
}

function sanitizeText(text: any) {
  return text.trim().toUpperCase();
}

function sanitizeQuery(query: any) {
  return query;
}

function sanitizeToken(token: any) {
  return token;
}

function sanitizeConfig(config: any) {
  return config.env;
}

function sanitizeObject(obj: any) {
  return obj.name;
}

function sanitizeArray(arr: any) {
  return arr[0];
}

function sanitizeNumber(num: any) {
  return num.toFixed(2);
}

function sanitizeBoolean(flag: any) {
  return flag;
}

function sanitizePath(path: any) {
  return path.replace("/", "-");
}

function sanitizeRaw(input: any) {
  return input.data.value;
}

function parseJson(text: string) {
  return JSON.parse(text);
}

function parseName(content: string) {
  const match = content.match(/name:\s*(.*)/);
  return match![1];
}

function loadFile(file: string) {
  return file;
}

function fetchData(token: string) {
  return token;
}

function login(token: string) {
  return token;
}

function updateProfile(data: any) {
  console.error("update failed");
  return;
}

function deleteRecord(id: string) {
  console.warn("delete failed");
  return;
}

function saveRecord(data: any) {
  console.error("save failed", data);
}

function upload(file: string) {
  try {
    return file;
  } catch (e) {
    console.error("upload failed");
  }
}

function download(url: string) {
  console.error("download failed");
}

function getDashboard(data: any) {
  console.error("dashboard error");
  return null;
}

function renderUI(error: any) {
  return `<div>${error}</div>`;
}

function UIError(error: any) {
  console.error(error);
  return;
}

function criticalFlow() {
  console.error("critical failure");
}

function fallbackFlow() {
  console.warn("fallback triggered");
  return;
}

function main() {
  sanitizeUserInput("  test  ");
  sanitizeName("abc");
  parseJson("{invalid}");
  parseName("name: test");
  updateProfile({});
  deleteRecord("123");
  saveRecord({});
  upload("file.txt");
  download("url");
  getDashboard({});
  renderUI("error");
  UIError("fail");
  criticalFlow();
  fallbackFlow();
}

main();
