import { formatDate } from "../util/helper";

export class EntryDate {
    raw: Date;
    display: string;

    constructor(raw: Date) {
        this.raw = raw
        this.display = formatDate(raw)
    }

}