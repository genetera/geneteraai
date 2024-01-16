export interface INotifications {
  id: string;
  organization: string;
  project: string;
  title: string;
  message: string;
  message_html: string;
  sender: string;
  triggered_by: string;
  receiver: string;
  read_at: string;
  archived_at: string;
  created_at: string;
  updated_at: string;
}
