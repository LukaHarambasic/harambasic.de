export default {
    'title': (value: string) => `Correo para ${value}`,
    'description': () => `Luka te envió una postal digital.`,
    'socialImgAlt': () => 'Imagen de postal puramente decorativa',
    'greeting': (value: string) => `¡Hola ${value},`,
    'farewell': () => 'Feliz Navidad, ',
    'frontTitle': (value: string) => `Feliz Navidad ${value}`,
    'frontGenerated': (value: string) => `Imagen única generada para <em>${value}</em>`,
    'frontBlink': () => `¡Haz clic aquí!`,
    'footerGenerated': (value: string) => `Imagen única generada para <em>${value}</em> por OpenAi - DALL·E 3`,
    'footerBy': () => `Diseñado y desarrollado por <a style="color: rgba(1, 3, 15, 0.6);" href="https://harambasic.de">Luka Harambasic</a>`
}
