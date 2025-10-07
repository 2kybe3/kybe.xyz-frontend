const term = document.getElementById('terminal') as HTMLDivElement;

const outputContainer = document.createElement('div');
outputContainer.classList.add('terminal-output');
term.appendChild(outputContainer);

type CommandFn = (args: string[]) => string;

const commands: Record<string, CommandFn> = {
	help: () => `Available commands: ${Object.keys(commands).join(', ')}`,
	clear: () => { outputContainer.innerHTML = ""; return ""; },
	echo: (args) => args.join(' ')
};

function print(text: string) {
	if (!text.trim()) return;
	const line = document.createElement('div');
	line.classList.add('terminal-line');
	line.textContent = text;
	outputContainer.appendChild(line);
	term.scrollTop = term.scrollHeight;
}

function inputCommand(cmd: string) {
	const [baseCmd, ...args] = cmd.trim().split(" ");

	print(`$ ${cmd}`);

	const command = commands[baseCmd];
	if (command) {
		const result = command(args);
		if (result) print(result);
	} else if (cmd.trim()) {
		print(`Command not found: ${baseCmd}`);
	}
}

function createPrompt() {
	const inputWrapper = document.createElement('div');
	inputWrapper.classList.add('prompt-wrapper');

	const promptSymbol = document.createElement('span');
	promptSymbol.textContent = "$ ";
	promptSymbol.classList.add('prompt-symbol');

	const input = document.createElement('input');
	input.type = 'text';
	input.classList.add('terminal-input');

	input.addEventListener('keydown', (e) => {
		if (e.key === "Enter") {
			inputCommand(input.value);
			term.removeChild(inputWrapper);
			createPrompt();
		}
	});

	inputWrapper.appendChild(promptSymbol);
	inputWrapper.appendChild(input);
	term.appendChild(inputWrapper);
	input.focus();
}

const welcome = document.createElement('div');
welcome.textContent = "Type 'help' to get started.";
welcome.classList.add('terminal-line');
term.insertBefore(welcome, outputContainer);

createPrompt();
