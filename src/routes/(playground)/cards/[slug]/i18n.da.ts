export default {
    'title': (value: string) => `Mail til ${value}`,
    'description': () => `Luka har sendt dig et digitalt postkort.`,
    'socialImgAlt': () => 'Rent dekorativt postkortbillede',
    'greeting': (value: string) => `Hejhej ${value},`,
    'farewell': () => 'Glædelig jul, ',
    'frontTitle': (value: string) => `Glædelig jul ${value}`,
    'frontGenerated': (value: string) => `Unikt billede genereret for <em>${value}</em>`,
    'frontBlink': () => `Klik her!`,
    'footerGenerated': (value: string) => `Unikt billede genereret for <em>${value}</em> af OpenAi - DALL·E 3`,
    'footerBy': () => `Designet & udviklet af <a style="color: rgba(1, 3, 15, 0.6);" href="https://harambasic.de">Luka Harambasic</a>`,
    'backDownload': () => `Descargar imagen`,
}
