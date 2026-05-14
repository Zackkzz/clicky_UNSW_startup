export type Society = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

export type Activity = {
  id: string;
  societyId: string;
  title: string;
  startsAt: string;
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
