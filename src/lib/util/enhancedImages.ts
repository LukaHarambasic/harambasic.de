import { getImageFromGlob, type ImageGlobResult } from './images';

const PROJECT_PATH = '../../assets/img/projects/';
const USES_PATH = '../../assets/img/uses/';
const WORK_PATH = '../../assets/img/work/';

const projectPictures: ImageGlobResult = import.meta.glob(
	'../../assets/img/projects/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
	{
		eager: true,
		query: {
			enhanced: true,
			w: '1280;640;400'
		}
	}
);

const usesPictures: ImageGlobResult = import.meta.glob(
	'../../assets/img/uses/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
	{
		eager: true,
		query: {
			enhanced: true,
			w: '1280;640;400'
		}
	}
);

const workPictures: ImageGlobResult = import.meta.glob(
	'../../assets/img/work/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
	{
		eager: true,
		query: {
			enhanced: true,
			w: '1280;640;400'
		}
	}
);

export const getProjectImage = (name: string) =>
	getImageFromGlob(projectPictures, PROJECT_PATH, name);
export const getUsesImage = (name: string) => getImageFromGlob(usesPictures, USES_PATH, name);
export const getWorkImage = (name: string) => getImageFromGlob(workPictures, WORK_PATH, name);
