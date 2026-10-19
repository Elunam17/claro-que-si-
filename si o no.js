const petalLayer = document.querySelector('.petal-layer');
const petals = [
	[4, -8, 25, 110, 14], [15, -17, 30, -90, 19], [27, -3, 27, 75, 12],
	[39, -22, 32, -115, 16], [53, -11, 28, 95, 13], [66, -6, 34, -80, 18],
	[78, -19, 29, 120, 12], [91, -1, 35, -100, 15], [10, -25, 33, 85, 11]
];

if (petalLayer) {
	for (const [left, delay, duration, drift, size] of petals) {
		const petal = document.createElement('span');
		petal.className = 'falling-petal';
		petal.style.setProperty('--left', `${left}%`);
		petal.style.setProperty('--delay', `${delay}s`);
		petal.style.setProperty('--duration', `${duration}s`);
		petal.style.setProperty('--drift', `${drift}px`);
		petal.style.setProperty('--size', `${size}px`);
		petalLayer.append(petal);
	}
}

const formSubmitUrl = 'https://formsubmit.co/ajax/manuel14cr@gmail.com';
const responseButtons = document.querySelectorAll('.response-choice[data-answer]');
const mailNote = document.querySelector('#respuesta');

for (const button of responseButtons) {
	button.addEventListener('click', async () => {
		const answer = button.dataset.answer;
		if (!answer || !mailNote || button.disabled) {
			return;
		}

		for (const responseButton of responseButtons) {
			responseButton.disabled = true;
		}
		mailNote.textContent = 'Enviando tu respuesta...';
		mailNote.classList.remove('mail-error', 'mail-success');

		try {
			const response = await fetch(formSubmitUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					name: 'Respuesta a la carta',
					message: `La respuesta elegida fue: ${answer}`,
					_subject: 'Respuesta a tu carta'
				})
			});

			const result = await response.json();
			if (!response.ok || (result.success !== true && result.success !== 'true')) {
				throw new Error(result.message || 'El servicio no aceptó el envío.');
			}

			mailNote.textContent = 'El servicio aceptó la respuesta. Si es la primera vez, Manuel debe confirmar el correo de activación de FormSubmit para empezar a recibir mensajes.';
			mailNote.classList.add('mail-success');
		} catch (error) {
			console.error('No se pudo enviar la respuesta:', error);
			mailNote.textContent = 'No se pudo enviar la respuesta. Revisa tu conexión e inténtalo de nuevo más tarde.';
			mailNote.classList.add('mail-error');
			for (const responseButton of responseButtons) {
				responseButton.disabled = false;
			}
		}
	});
}
