export default {
    'title': (value: string) => `Post für ${value}`,
    'description': () => `Luka hat dir eine digitale Postkarte geschickt.`,
    'socialImg': () => '', // TODO static image
    'socialImgAlt': () => 'Purely decorative postcard image',
    'greeting': (value: string) => `Hallo ${value},`,
    'farewell': () => 'Frohe Weihnachten, ',
    'addressLoading': () => 'Lade deine Adresse...',
}