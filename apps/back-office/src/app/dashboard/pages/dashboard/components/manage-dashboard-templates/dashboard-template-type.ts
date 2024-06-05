export type DashboardTemplate = ({ element: string } | { record: string }) & {
  content: string;
  name?: string;
};
