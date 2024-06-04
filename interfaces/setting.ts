import {array} from "yup";

export interface Setting {
    id: number;
    key: string;
    value: string|array;
    description: string;
}