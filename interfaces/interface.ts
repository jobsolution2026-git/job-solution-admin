export interface Image {
    link?: string;
    name?: string;
}

export interface Advertisement {
    id?: number;
    title?: string;
    ads_url?: string;
    audience?: string;
    groups?: string[];
    batch_ids?: number[];
    image?: Image | null;
    slug?: string;
}

export interface University {
    id: number;
    university:{
        title: string;
        description: string;
        website: string;
        groups: string[];
    };
    user:{
        name?: string;
        email?: string;
        phone?: string;
        institution?: string;
    }
}