import { User } from './user.model';

export class Message {
    type: string;
    text: string;
    reply: string;
    user: User;
    date: number;
    choices: string[];

    // tslint:disable-next-line:max-line-length
    constructor(type: string,
                text: string,
                reply: string,
                user: User,
                date: number,
                choices: string[]) {
        this.type = type;
        this.text = text;
        this.reply = reply;
        this.user = user;
        this.date = date;
        this.choices = choices;
    }
}
