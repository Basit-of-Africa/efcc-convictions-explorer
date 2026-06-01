import axios from "axios";
import { getApiBaseUrl } from "./api";

const STORAGE_KEY = "fraudcheckr_developer_session";
const API_KEY_STORAGE_KEY = "fraudcheckr_latest_api_key";

export function getDeveloperSessionToken() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

export function setDeveloperSessionToken(token) {
  localStorage.setItem(STORAGE_KEY, token);
}

export function clearDeveloperSessionToken() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStoredDeveloperApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
}

export function setStoredDeveloperApiKey(apiKey) {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

export function clearStoredDeveloperApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

export function getDeveloperApiBaseUrl() {
  return getApiBaseUrl();
}

export function getDeveloperSessionHeaders() {
  const token = getDeveloperSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function developerSignup(payload) {
  const response = await axios.post(
    `${getDeveloperApiBaseUrl()}/developer/auth/signup`,
    payload,
  );
  return response.data;
}

export async function developerLogin(payload) {
  const response = await axios.post(
    `${getDeveloperApiBaseUrl()}/developer/auth/login`,
    payload,
  );
  return response.data;
}

export async function fetchDeveloperProfile() {
  const response = await axios.get(`${getDeveloperApiBaseUrl()}/developer/me`, {
    headers: getDeveloperSessionHeaders(),
  });
  return response.data;
}

export async function fetchDeveloperPlans() {
  const response = await axios.get(`${getDeveloperApiBaseUrl()}/developer/plans`);
  return response.data;
}

export async function initializeDeveloperBilling(planName) {
  const response = await axios.post(
    `${getDeveloperApiBaseUrl()}/developer/billing/initialize`,
    { plan_name: planName },
    { headers: getDeveloperSessionHeaders() },
  );
  return response.data;
}

export async function fetchDeveloperApiKeys() {
  const response = await axios.get(`${getDeveloperApiBaseUrl()}/developer/api-keys`, {
    headers: getDeveloperSessionHeaders(),
  });
  return response.data;
}

export async function rotateDeveloperApiKey() {
  const response = await axios.post(
    `${getDeveloperApiBaseUrl()}/developer/api-keys/rotate`,
    {},
    { headers: getDeveloperSessionHeaders() },
  );
  return response.data;
}

export async function runScreeningReport(payload, apiKey) {
  const response = await axios.post(
    `${getDeveloperApiBaseUrl()}/developer/v1/screen`,
    payload,
    { headers: { "X-API-Key": apiKey } },
  );
  return response.data;
}

export async function fetchScreeningReports() {
  const response = await axios.get(`${getDeveloperApiBaseUrl()}/developer/reports`, {
    headers: getDeveloperSessionHeaders(),
  });
  return response.data;
}

export async function fetchScreeningReport(reportId) {
  const response = await axios.get(
    `${getDeveloperApiBaseUrl()}/developer/reports/${reportId}`,
    { headers: getDeveloperSessionHeaders() },
  );
  return response.data;
}
