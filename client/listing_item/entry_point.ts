import './item.scss';
import $ from 'jquery';

let currentCarouselImage: number = 0;

export function setCarouselImg (num: number): void {
	const images = $('#gallery>img');
	console.log(images.length);
	if (images.length > 0) {
		currentCarouselImage = ((num % images.length) + images.length) % images.length;
		for (let i = 0; i < images.length; i++) {
			images[i].classList.remove('leftimg', 'rightimg');
			if (i < currentCarouselImage) images[i].classList.add('leftimg');
			else if (i > currentCarouselImage) images[i].classList.add('rightimg');
		}
	}
}

export function nextCarouselImg (): void {
	setCarouselImg(currentCarouselImage + 1);
}

export function prevCarouselImg (): void {
	setCarouselImg(currentCarouselImage - 1);
}

$(() => {
	$('#nxtgal').on('click', () => {
		nextCarouselImg();
	});
	$('#prvgal').on('click', () => {
		prevCarouselImg();
	});
});
