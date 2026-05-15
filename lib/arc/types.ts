export type Society = {
  id: string;
  name: string;
  /** Longer blurb when ARC supplies it (maps DB `societies.description`). */
  description: string | null;
  /** Multi-value discovery tags (maps DB `societies.tags`; XLSX often only has `category`). */
  tags: string[];
};

export type Activity = {
  id: string;
  societyId: string;
  title: string;
  /** Long body when ARC supplies it (maps DB `activities.description`). */
  description?: string | null;
  /** Multi-value tags (maps DB `activities.tags`; workbook "Event Type / Tag" seeds one value). */
  tags?: string[];
  /** Single primary type label from Rubric (maps DB `activities.event_type`). */
  eventType?: string | null;
  startsAt: string;
  endsAt: string;
  location: string;
  ticketUrl: string | null;
};

export type ArcDataset = {
  societies: Society[];
  activities: Activity[];
};

export type ArcRepository = {
  loadAll(): Promise<ArcDataset>;
};
