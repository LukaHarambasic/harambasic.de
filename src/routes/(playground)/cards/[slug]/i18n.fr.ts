export default {
	title: (value: string) => `Courrier pour ${value}`,
	description: () => `Luka vous a envoyé une carte postale numérique.`,
	socialImgAlt: () => 'Image de carte postale purement décorative',
	greeting: (value: string) => `Heyho ${value},`,
	farewell: () => 'Joyeux Noël, ',
	frontTitle: (value: string) => `Joyeux Noël ${value}`,
	frontGenerated: (value: string) => `Image unique générée pour <em>${value}</em>`,
	frontBlink: () => `Cliquez ici !`,
	footerGenerated: (value: string) =>
		`Image unique générée pour <em>${value}</em> par OpenAi - DALL·E 3`,
	footerBy: () =>
		`Conçu & développé par <a style="color: rgba(1, 3, 15, 0.6);" href="https://harambasic.de">Luka Harambasic</a>`,
	backDownload: () => `Télécharger l'image`
};
