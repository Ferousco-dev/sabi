import { fetchJson, type FetchResult } from "../api";

export type Child = { id: number; name: string; email: string; linked_at: string };
export type ChildrenResponse = { success: true; children: Child[] };

export function getChildren(): Promise<FetchResult<ChildrenResponse>> {
  return fetchJson<ChildrenResponse>("/parent/children.php", { method: "GET" });
}

export function linkChild(email: string): Promise<FetchResult<{ success: boolean; message?: string }>> {
  return fetchJson("/parent/children.php", { method: "POST", body: JSON.stringify({ email }) });
}

export type AlertPreferences = { sms_enabled: boolean; email_enabled: boolean; phone_number: string | null };
export type AlertsResponse = { success: true; alerts: AlertPreferences };

export function getAlertPreferences(): Promise<FetchResult<AlertsResponse>> {
  return fetchJson<AlertsResponse>("/parent/alerts.php", { method: "GET" });
}

export function updateAlertPreferences(data: Partial<AlertPreferences>): Promise<FetchResult<{ success: boolean }>> {
  return fetchJson("/parent/alerts.php", { method: "POST", body: JSON.stringify(data) });
}
