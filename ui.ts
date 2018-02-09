// TODO rewrite this in a way that's less gross
document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("decrypt").addEventListener("click", function(e) {
		e.preventDefault();

		let ciphertext = (<HTMLInputElement>document.getElementById("input")).value;
		let deck = (<HTMLInputElement>document.getElementById("deck")).value;

		let decrypted = decryptMain(ciphertext, deck);

		(<HTMLInputElement>document.getElementById("result")).textContent = decrypted;
	});

	document.getElementById("encrypt").addEventListener("click", function(e) {
		e.preventDefault();

		let plaintext = (<HTMLInputElement>document.getElementById("input")).value;
		let deck = (<HTMLInputElement>document.getElementById("deck")).value;

		let encrypted = encryptMain(plaintext, deck);

		(<HTMLInputElement>document.getElementById("result")).textContent = encrypted;
	});
});
