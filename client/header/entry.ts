import './header.scss';
import $ from 'jquery';
$(() => {
	const params = new URLSearchParams(location.search);
	params.forEach((val, key) => {
		if (key.startsWith('err-')) {
			const elem = $(`input[name=${key.substring('err-'.length)}]`);
			if (elem.length >= 1) {
				$('<br/><span class="err-msg"></span>').text(val).insertAfter(elem);
			}
		}
	});
});
