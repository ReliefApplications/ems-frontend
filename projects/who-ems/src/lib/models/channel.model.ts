import { Application } from "./application.model";

export interface Channel {
    id?: string;
    title?: string;
    application?: Application
}
