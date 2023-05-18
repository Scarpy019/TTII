import $ from 'jquery';
import './image_input.scss';

const imageArray: File[] = [];

function addImage (file: File): void {
	const display = $('#imgdisplay');
	display.append(`<img src="${URL.createObjectURL(file)}">`);
	imageArray.push(file);
}

$('#imgupload').on('change', () => {
	const upload = $('#imgupload')[0];
	if (upload instanceof HTMLInputElement) {
		if (upload.files !== null) {
			const f = upload.files[0];
			console.log(f);
			addImage(f);
			$('#imgupload').val('');
		}
	}
});
