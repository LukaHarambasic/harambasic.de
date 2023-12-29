export default {
  title: (value: string) => `Mail for ${value}`,
  description: () => `Luka sent you a digital postcard.`,
  socialImgAlt: () => 'Purely decorative postcard image',
  greeting: (value: string) => `Heyho ${value},`,
  farewell: () => 'Merry Christmas, ',
  frontTitle: (value: string) => `Merry Christmas ${value}`,
  frontGenerated: (value: string) => `Unique image generated for <em>${value}</em>`,
  frontBlink: () => `Click here!`,
  footerGenerated: (value: string) => `Unique image generated for <em>${value}</em> by OpenAi - DALL·E 3`,
  footerBy: () => `Designed & developed by <a style="color: rgba(1, 3, 15, 0.6);" href="https://harambasic.de">Luka Harambasic</a>`,
  backDownload: () => `Download picture`
}
