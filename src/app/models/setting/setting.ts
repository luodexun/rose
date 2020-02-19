export class Setting {
    public language: string;
    public darkMode: boolean;
    public notification: boolean;
    public usePassword:boolean;

    constructor() {}

    public static defaults(lang: string): Setting {
        const settings = new Setting();
        settings.language = lang;
        settings.darkMode = false;
        settings.notification = false;
        settings.usePassword = false;
        return settings;
    }
}
