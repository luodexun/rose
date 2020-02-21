import  Pagination from "./pagination"
import { JsonProperty } from 'json-typescript-mapper';
export class Results {
    @JsonProperty('id')
    public id: number;

    @JsonProperty('cate')
    public cate: number;

    @JsonProperty('title')
    public title: string;

    @JsonProperty('icon')
    public icon: string;

    @JsonProperty('desc')
    public desc: string;

    @JsonProperty('view_count')
    public view_count: number;

    @JsonProperty('star_count')
    public star_count: number;

    @JsonProperty('share_count')
    public share_count: number;

    constructor() {
        this.id = void 0;
        this.cate = void 0;
        this.title = void 0;
        this.icon = void 0;
        this.desc = void 0;
        this.view_count = void 0;
        this.star_count = void 0;
        this.share_count = void 0;
    }
}
export class Information {
    @JsonProperty({clazz: Pagination, name: 'metadata'})
    public metadata: Pagination;

    @JsonProperty({clazz: Results, name: 'results'})
    public results?: Results[];

    constructor() {
        this.metadata = void 0;
        this.results = void 0;
    }
}
