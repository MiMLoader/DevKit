export interface Mod {
    name: string;
    description: string;
    author: string;
    version: string;
    homepage: string;
    preload: string | false;
    main: string;
    dependencies: string[] | string;
    tags: string[] | string;
    priority: number;
}