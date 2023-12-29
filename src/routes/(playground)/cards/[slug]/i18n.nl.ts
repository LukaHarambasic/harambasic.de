export default {
  title: (value: string) => `Mail voor ${value}`,
  description: () => `Luka heeft je een digitale ansichtkaart gestuurd.`,
  socialImgAlt: () => 'Puut decoratieve ansichtkaart afbeelding',
  greeting: (value: string) => `Heyho ${value},`,
  farewell: () => 'Prettige Kerstdagen, ',
  frontTitle: (value: string) => `Vrolijk Kerstfeest ${value}`,
  frontGenerated: (value: string) => `Unieke afbeelding gegenereerd voor <em>${value}</em>`,
  frontBlink: () => `Klik hier!`,
  footerGenerated: (value: string) => `Unieke afbeelding gegenereerd voor <em>${value}</em> door OpenAi - DALL·E 3`,
  footerBy: () => `Ontworpen & ontwikkeld door <a style="color: rgba(1, 3, 15, 0.6);" href="https://harambasic.de">Luka Harambasic</a>`,
  backDownload: () => `Download afbeelding`
}
