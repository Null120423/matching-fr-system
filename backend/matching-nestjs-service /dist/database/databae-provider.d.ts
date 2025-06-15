export declare const databaseProvider: {
    provide: string;
    useFactory: () => Promise<import("typeorm").DataSource | undefined>;
};
