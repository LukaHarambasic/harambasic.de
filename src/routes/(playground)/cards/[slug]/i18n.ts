export function t(key: string, languageCode: string, value?: any): string {
    const languages = import.meta.glob('./i18n.*.ts', { eager: true })
    const {default: language} = languages[`./i18n.${languageCode}.ts`]
    return language[key](value)
}