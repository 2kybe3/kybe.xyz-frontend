const boxes = document.querySelectorAll<HTMLElement>('[data-copy-target]');

boxes.forEach(box => {
	box.addEventListener('click', async () => {
		const codeElement = box.querySelector<HTMLElement>('code');
		const copyHint = box.querySelector<HTMLElement>('.copy-hint');

		if (!codeElement || !copyHint) return;

		const text = codeElement.innerText;

		try {
			await navigator.clipboard.writeText(text);

			box.classList.add('copied');
			copyHint.classList.add('copied');
			copyHint.textContent = 'Copied!';

			setTimeout(() => {
				box.classList.remove('copied');
				copyHint.classList.remove('copied');
				copyHint.textContent = 'Click to copy';
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
			copyHint.classList.add('copied');
			copyHint.textContent = 'Failed to copy';
			setTimeout(() => {
				copyHint.classList.remove('copied');
				copyHint.textContent = 'Click to copy';
			}, 2000);
		}
	});
});
