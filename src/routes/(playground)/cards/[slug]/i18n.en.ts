export default {
    'title': (value: string) => `Mail for ${value}`,
    'description': () => `Luka sent you a digital postcard.`,
    'socialImg': () => '', // TODO static image
    'socialImgAlt': () => 'Purely decorative postcard image',
    'greeting': (value: string) => `Heyho ${value},`,
    'farewell': () => 'Merry Christmas, ',
    'addressLoading': () => 'Fetching your address...',
}
