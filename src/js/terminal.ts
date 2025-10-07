const term = document.getElementById('terminal') as HTMLDivElement;

const outputContainer = document.createElement('div');
outputContainer.classList.add('terminal-output');
term.appendChild(outputContainer);

type CommandFn = (args: string[]) => string;

const commands: Record<string, CommandFn> = {
	help: () => `Available commands: ${Object.keys(commands).join(', ')}`,
	clear: () => { outputContainer.innerHTML = ""; return ""; },
	matrix: (args = []) => {
		const noRedirect = args.includes('no-redirect');
		if (noRedirect) {
			window.location.href = '/matrix.html';
		} else {
			window.location.href = '/matrix.html?redirect=true';
		}
		return '';
	},
	date: () => {
		const now = new Date();

		const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const months = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];

		const pad = (n: number) => n.toString().padStart(2, '0');

		const dayName = weekdays[now.getDay()];
		const monthName = months[now.getMonth()];
		const monthNumber = pad(now.getMonth() + 1);
		const day = pad(now.getDate());
		const year = now.getFullYear();
		const hours = pad(now.getHours());
		const minutes = pad(now.getMinutes());
		const seconds = pad(now.getSeconds());
		const ms = now.getMilliseconds().toString().padStart(3, '0');

		return `${dayName}, ${day}.${monthNumber}.${year} (${monthName}) ${hours}:${minutes}:${seconds}.${ms}`;
	},
	whoami: () => "kybe",
	cat: () => {
		return `
      /\\_/\\  
     ( o.o ) 
      > ^ <
    `;
	},
	calc: (args = []) => {
		if (args.length === 0) return "Usage: calc <expression>";
		const expr = args.join(' ');
		try {
			const result = Function(`"use strict"; return (${expr})`)();
			return `${expr} = ${result}`;
		} catch {
			return "Invalid expression";
		}
	},
	echo: (args) => args.join(' '),
	timer: (args = []) => {
		if (args.length === 0) return "Usage: timer <seconds>";

		const seconds = parseInt(args[0]);
		if (isNaN(seconds) || seconds <= 0) return "Please provide a valid number of seconds";

		let remaining = seconds;
		print(`Timer started for ${seconds} second(s)`);

		const interval = setInterval(() => {
			if (remaining <= 0) {
				print("Timer finished!");
				clearInterval(interval);
			} else {
				print(`${remaining} second(s) remaining`);
				remaining--;
			}
		}, 1000);

		return "";
	},
	shake: () => {
		const term = document.getElementById('terminal') as HTMLDivElement;
		if (!term) return "";

		let i = 0;
		const interval = setInterval(() => {
			const x = (Math.random() - 0.5) * 10;
			const y = (Math.random() - 0.5) * 10;
			term.style.transform = `translate(${x}px, ${y}px)`;
			i++;
			if (i > 15) {
				clearInterval(interval);
				term.style.transform = ""; // reset
			}
		}, 60);

		return "Shaking terminal...";
	},
	ascii: (args = []) => {
		if (args.length === 0) return "Usage: ascii <text>";
		const text = args.join(" ").toUpperCase();

		// Simple block letters A-Z
		const letters: Record<string, string[]> = {
			A: ["  A  ", " A A ", "AAAAA", "A   A", "A   A"],
			B: ["BBBB ", "B   B", "BBBB ", "B   B", "BBBB "],
			C: [" CCC ", "C   C", "C    ", "C   C", " CCC "],
			D: ["DDDD ", "D   D", "D   D", "D   D", "DDDD "],
			E: ["EEEEE", "E    ", "EEE  ", "E    ", "EEEEE"],
			F: ["FFFFF", "F    ", "FFF  ", "F    ", "F    "],
			G: [" GGG ", "G    ", "G  GG", "G   G", " GGG "],
			H: ["H   H", "H   H", "HHHHH", "H   H", "H   H"],
			I: [" III ", "  I  ", "  I  ", "  I  ", " III "],
			J: ["  JJJ", "   J ", "   J ", "J  J ", " JJ  "],
			K: ["K  K ", "K K  ", "KK   ", "K K  ", "K  K "],
			L: ["L    ", "L    ", "L    ", "L    ", "LLLLL"],
			M: ["M   M", "MM MM", "M M M", "M   M", "M   M"],
			N: ["N   N", "NN  N", "N N N", "N  NN", "N   N"],
			O: [" OOO ", "O   O", "O   O", "O   O", " OOO "],
			P: ["PPPP ", "P   P", "PPPP ", "P    ", "P    "],
			Q: [" QQQ ", "Q   Q", "Q   Q", "Q  Q ", " QQ Q"],
			R: ["RRRR ", "R   R", "RRRR ", "R R  ", "R  RR"],
			S: [" SSS ", "S    ", " SSS ", "    S", " SSS "],
			T: ["TTTTT", "  T  ", "  T  ", "  T  ", "  T  "],
			U: ["U   U", "U   U", "U   U", "U   U", " UUU "],
			V: ["V   V", "V   V", "V   V", " V V ", "  V  "],
			W: ["W   W", "W   W", "W W W", "WW WW", "W   W"],
			X: ["X   X", " X X ", "  X  ", " X X ", "X   X"],
			Y: ["Y   Y", " Y Y ", "  Y  ", "  Y  ", "  Y  "],
			Z: ["ZZZZZ", "   Z ", "  Z  ", " Z   ", "ZZZZZ"],
			" ": ["     ", "     ", "     ", "     ", "     "]
		};

		const lines = ["", "", "", "", ""];

		for (const char of text) {
			const pattern = letters[char] || letters[" "];
			for (let i = 0; i < 5; i++) {
				lines[i] += pattern[i] + " ";
			}
		}

		return lines.join("\n");
	},
	todo: (args = []) => {
		const todos: string[] = JSON.parse(localStorage.getItem("todos") || "[]");

		if (args.length === 0) {
			return todos.length ? todos.map((t, i) => `${i + 1}. ${t}`).join("\n") : "No todos yet";
		}

		const subCmd = args[0];
		const rest = args.slice(1).join(" ");

		switch (subCmd) {
			case "add":
				if (!rest) return "Usage: todo add <task>";
				todos.push(rest);
				localStorage.setItem("todos", JSON.stringify(todos));
				return `Added: "${rest}"`;
			case "remove":
				const index = parseInt(rest) - 1;
				if (isNaN(index) || index < 0 || index >= todos.length) return "Invalid index";
				const removed = todos.splice(index, 1)[0];
				localStorage.setItem("todos", JSON.stringify(todos));
				return `Removed: "${removed}"`;
			case "list":
				return todos.length ? todos.map((t, i) => `${i + 1}. ${t}`).join("\n") : "No todos yet";
			case "clear":
				localStorage.setItem("todos", JSON.stringify([]));
				return "Cleared all todos";
			default:
				return "Usage: todo add|remove|list|clear";
		}
	},
	color: (args = []) => {
		const termEl = document.getElementById('terminal') as HTMLDivElement;
		if (!termEl) return "";

		const defaultColors: Record<string, { text: string, bg: string }> = {
			red: { text: "#ff5555", bg: "#330000" },
			green: { text: "#55ff55", bg: "#003300" },
			blue: { text: "#5555ff", bg: "#000033" },
			yellow: { text: "#ffff55", bg: "#333300" },
			purple: { text: "#ff55ff", bg: "#330033" },
			cyan: { text: "#55ffff", bg: "#003333" },
			white: { text: "#ffffff", bg: "#000000" },
			black: { text: "#000000", bg: "#ffffff" },
			reset: { text: "", bg: "" }
		};

		const savedColors = JSON.parse(localStorage.getItem("terminalColorPresets") || "{}") as Record<string, { text: string, bg: string }>;
		const colors = { ...defaultColors, ...savedColors };

		if (args.length === 0) {
			return "Usage: color <preset|add|list|reset|save|load>\nPresets: " + Object.keys(colors).join(", ");
		}

		const command = args[0].toLowerCase();

		if (command === "reset") {
			termEl.style.color = "";
			termEl.style.background = "";
			return "Terminal colors reset";
		}

		if (command === "add") {
			if (args.length < 4) return "Usage: color add <name> <text-color> <bg-color>";
			const name = args[1].toLowerCase();
			const text = args[2];
			const bg = args[3];
			savedColors[name] = { text, bg };
			localStorage.setItem("terminalColorPresets", JSON.stringify(savedColors));
			return `Added new color preset '${name}'`;
		}

		if (command === "list") {
			const lines = Object.entries(colors).map(([name, c]) => `${name}: text=${c.text || "default"}, bg=${c.bg || "default"}`);
			return lines.join("\n");
		}

		if (command === "load") {
			const saved = localStorage.getItem("terminalColors");
			if (!saved) return "No saved colors found";
			const loaded = JSON.parse(saved) as { text: string; bg: string };
			termEl.style.color = loaded.text;
			termEl.style.background = loaded.bg;
			return "Saved terminal colors loaded";
		}

		if (command === "save") {
			localStorage.setItem("terminalColors", JSON.stringify({ text: termEl.style.color, bg: termEl.style.background }));
			return "Current terminal colors saved";
		}

		const color = colors[command];
		if (!color) return `Unknown preset: ${command}`;

		termEl.style.color = color.text;
		termEl.style.background = color.bg;
		return `Terminal colors changed to ${command}`;
	},
	reverse: (args = []) => {
		if (args.length === 0) return "Usage: reverse <text>";
		return args.join(" ").split("").reverse().join("");
	},
	mock: (args = []) => {
		if (args.length === 0) return "Usage: mock <text>";
		const text = args.join(" ");
		return text
			.split("")
			.map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())
			.join("");
	},
	spin: () => {
		const spinLine = document.createElement('div');
		spinLine.classList.add('terminal-line');
		outputContainer.appendChild(spinLine);

		const frames = ["|", "/", "-", "\\"];
		let i = 0;
		setInterval(() => {
			spinLine.textContent = frames[i % frames.length];
			term.scrollTop = term.scrollHeight;
			i++;
		}, 100);

		return '';
	},
	invert: () => {
		const termEl = document.getElementById('terminal') as HTMLDivElement;
		if (!termEl) return "";
		const currentText = getComputedStyle(termEl).color;
		const currentBg = getComputedStyle(termEl).backgroundColor;
		termEl.style.color = currentBg;
		termEl.style.background = currentText;
		return "Terminal colors inverted!";
	},
	"color-random": () => {
		const termEl = document.getElementById('terminal') as HTMLDivElement;
		if (!termEl) return "";
		const randomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
		termEl.style.color = randomColor();
		termEl.style.background = randomColor();
		return "Terminal colors changed randomly!";
	},
	"8ball": (args = []) => {
		if (args.length === 0) return "Usage: 8ball <question>";
		const answers = [
			"It is certain", "Without a doubt", "You may rely on it", "Ask again later",
			"Cannot predict now", "Don't count on it", "My sources say no", "Very doubtful"
		];
		return answers[Math.floor(Math.random() * answers.length)];
	},
	coinflip: () => Math.random() < 0.5 ? "Heads" : "Tails",
};

function print(text: string) {
	if (!text.trim()) return;

	let element: HTMLElement;
	if (text.includes("\n")) {
		element = document.createElement('pre');
		element.classList.add('terminal-line');
		element.textContent = text;
	} else {
		element = document.createElement('div');
		element.classList.add('terminal-line');
		element.textContent = text;
	}

	outputContainer.appendChild(element);
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
