export default {
    'title': (value: string) => `Post für ${value}`,
    'description': () => `Luka hat dir eine digitale Postkarte geschickt.`,
    'socialImgAlt': () => 'Purely decorative postcard image',
    'greeting': (value: string) => `Heyho ${value},`,
    'farewell': () => 'Frohe Weihnachten, ',
    'addressLoading': () => 'Lade deine Adresse...',
    'frontTitle': (value: string) => `Frohe Weihnachten ${value}`,
    'frontGenerated': (value: string) => `Einzigartiges Bild für <em>${value}</em>`,
    'frontBlink': () => `Klicke hier!`,
    'footerGenerated': (value: string) => `Einzigartiges Bild für <em>${value}</em> von OpenAi - DALL·E 3`,
    'footerBy': () => `Designt & entwickelt von <a style="color: rgba(1, 3, 15, 0.6);" href="https://harambasic.de">Luka Harambasic</a>`,
    'backDownload': () => `Bild herunterladen`,
}