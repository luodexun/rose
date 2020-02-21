import { JsonProperty } from 'json-typescript-mapper';
export default class Pagination {
    @JsonProperty('count')
    public count: number;

    @JsonProperty('totalPages')
    public totalPages: number;

    @JsonProperty('totalCount')
    public totalCount: number;

    @JsonProperty('next')
    public next: string;

    @JsonProperty('previous')
    public previous: string;

    @JsonProperty('self')
    public self: string;

    @JsonProperty('first')
    public first: string;

    @JsonProperty('last')
    public last: string;

    constructor() {
        this.count = void 0;
        this.totalPages = void 0;
        this.totalCount = void 0;
        this.next = void 0;
        this.previous = void 0;
        this.self = void 0;
        this.first = void 0;
        this.last = void 0;
    }
}
