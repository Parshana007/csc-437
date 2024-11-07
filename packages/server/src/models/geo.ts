export interface PickupLocation {
  name?: string;
  address?: string;
  locationType: locationType;
}

export type locationType = "address" | "disclosed in communication";
