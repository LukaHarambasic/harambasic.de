export function t(key: string, languageCode: string = 'en', value?: any): string {
  const languages = import.meta.glob('./i18n.*.ts', { eager: true })
  const languageModule = languages[`./i18n.${languageCode}.ts`]
  if (!languageModule) {
    return `error.${key}`
  }
  const language = languageModule.default
  return language[key](value)
}
