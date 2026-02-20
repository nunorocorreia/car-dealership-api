export const LEAD_TYPES = ["TEST_DRIVE", "INQUIRY", "PURCHASE"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const LEAD_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: string;
  carId: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  message?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface CreateLeadInput {
  carId: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  message?: string;
}
