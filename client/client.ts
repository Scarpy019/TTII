import $ from 'jquery';

async function signout (): Promise<void> {
	await fetch('/signout', {
		method: 'DELETE'
	});
	location.reload();
}

$('#signoutbutton').on('click', signout);
