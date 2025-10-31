const term = document.getElementById('terminal') as HTMLDivElement;

const outputContainer = document.createElement('div');
outputContainer.classList.add('terminal-output');
term.appendChild(outputContainer);

type CommandFn = (args: string[]) => string;

const commandHistory: string[] = JSON.parse(localStorage.getItem("commandHistory") || "[]");
const aliases: Record<string, string> = JSON.parse(localStorage.getItem("aliases") || "{}");
let currentDir = "/home/kybe";
const fileSystem: Record<string, string[]> = {
	"/": ["home", "usr", "var", "etc"],
	"/home": ["kybe"],
	"/home/kybe": ["documents", "downloads", "projects", "secret"],
	"/home/kybe/secret": [".hiddenfile"],
	"/home/kybe/documents": ["notes.txt", "todo.txt", "readme.md"],
	"/home/kybe/downloads": ["file1.zip", "image.png"],
	"/home/kybe/projects": ["terminal.js", "website.html"],
	"/usr": ["bin", "lib", "share"],
	"/var": ["log", "tmp"],
	"/etc": ["config"]
};
const fileContents: Record<string, string> = JSON.parse(localStorage.getItem("fileContents") || JSON.stringify({
	"/home/kybe/documents/notes.txt": "Remember to finish the terminal project!\nAdd more cool commands.\n",
	"/home/kybe/documents/todo.txt": "- Learn TypeScript\n- Build awesome terminal\n- Add file system\n",
	"/home/kybe/documents/readme.md": "# My Terminal\n\nThis is a custom web-based terminal.\n\n## Features\n- File system navigation\n- Command aliases\n- And much more!\n",
	"/home/kybe/projects/terminal.js": "// Terminal implementation\nconsole.log('Hello, terminal!');\n",
	"/home/kybe/projects/website.html": "<!DOCTYPE html>\n<html>\n<head><title>My Site</title></head>\n<body><h1>Hello World</h1></body>\n</html>\n",
	"/home/kybe/secret/.hiddenfile": "This is a hidden file. Shh!\n"
}));

const commands: Record<string, CommandFn> = {
	help: () => `Available commands: ${Object.keys(commands).join(', ')}`,
	clear: () => {
		outputContainer.innerHTML = "";
		return "";
	},
	matrix: (args = []) => {
		const noRedirect = args.includes('no-redirect');
		if (noRedirect) {
			window.location.href = '/matrix.html';
		} else {
			window.location.href = '/matrix.html?redirect=true';
		}
		return '';
	},
	ssh: () => {
		window.location.href = '/ssh.html';
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
	cat: (args = []) => {
		if (args.length === 0) return "Usage: cat <filename>";

		const filename = args[0];
		const fullPath = currentDir === "/" ? `/${filename}` : `${currentDir}/${filename}`;
		const content = fileContents[fullPath];

		if (content === undefined) {
			return `cat: ${filename}: No such file`;
		}

		return content;
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
				term.style.transform = "";
			}
		}, 60);

		return "Shaking terminal...";
	},
	ascii: (args = []) => {
		if (args.length === 0) return "Usage: ascii <text>";
		const text = args.join(" ").toUpperCase();

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
			red: {text: "#ff5555", bg: "#330000"},
			green: {text: "#55ff55", bg: "#003300"},
			blue: {text: "#5555ff", bg: "#000033"},
			yellow: {text: "#ffff55", bg: "#333300"},
			purple: {text: "#ff55ff", bg: "#330033"},
			cyan: {text: "#55ffff", bg: "#003333"},
			white: {text: "#ffffff", bg: "#000000"},
			black: {text: "#000000", bg: "#ffffff"},
			reset: {text: "", bg: ""}
		};

		const savedColors = JSON.parse(localStorage.getItem("terminalColorPresets") || "{}") as Record<string, {
			text: string,
			bg: string
		}>;
		const colors = {...defaultColors, ...savedColors};

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
			savedColors[name] = {text, bg};
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
			localStorage.setItem("terminalColors", JSON.stringify({text: termEl.style.color, bg: termEl.style.background}));
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
		const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
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
	history: () => {
		if (commandHistory.length === 0) return "No command history";
		return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n");
	},
	alias: (args = []) => {
		if (args.length === 0) {
			if (Object.keys(aliases).length === 0) return "No aliases defined";
			return Object.entries(aliases).map(([name, cmd]) => `${name}='${cmd}'`).join("\n");
		}
		if (args.length === 1 && args[0] === "clear") {
			localStorage.setItem("aliases", JSON.stringify({}));
			Object.keys(aliases).forEach(k => delete aliases[k]);
			return "All aliases cleared";
		}
		if (args.length < 2) return "Usage: alias <name> <command> or alias clear";
		const name = args[0];
		const command = args.slice(1).join(" ");
		aliases[name] = command;
		localStorage.setItem("aliases", JSON.stringify(aliases));
		return `Alias created: ${name}='${command}'`;
	},
	pwd: () => currentDir,
	cd: (args = []) => {
		if (args.length === 0) {
			currentDir = "/home/kybe";
			return "";
		}
		let target = args[0];

		if (target === "..") {
			if (currentDir === "/") return "";
			const parts = currentDir.split("/").filter(p => p);
			parts.pop();
			currentDir = "/" + parts.join("/");
			if (currentDir === "/") currentDir = "/";
			return "";
		}

		if (target === "~") {
			currentDir = "/home/kybe";
			return "";
		}

		if (!target.startsWith("/")) {
			target = currentDir === "/" ? `/${target}` : `${currentDir}/${target}`;
		}

		if (fileSystem[target]) {
			currentDir = target;
			return "";
		}

		return `cd: ${args[0]}: No such directory`;
	},
	ls: (args = []) => {
		const showHidden = args.includes("-a");
		const longFormat = args.includes("-l");

		const items = fileSystem[currentDir] || [];
		if (items.length === 0) return "";

		if (longFormat) {
			return items.map(item => {
				const isDir = fileSystem[currentDir === "/" ? `/${item}` : `${currentDir}/${item}`];
				const type = isDir ? "d" : "-";
				const perms = isDir ? "rwxr-xr-x" : "rw-r--r--";
				const size = isDir ? "4096" : Math.floor(Math.random() * 100000);
				const date = "Oct  7 12:34";
				if (!showHidden && item.startsWith(".")) return "";
				return `${type}${perms} 1 kybe kybe ${size} ${date} ${item}`;
			}).join("\n");
		}

		return items.join("  ");
	},
	rm: (args = []) => {
		if (args.length === 0) return "Usage: rm <filename>";
		const filename = args[0];

		const dirContents = fileSystem[currentDir] || [];
		const index = dirContents.indexOf(filename);

		if (index === -1) {
			return `rm: cannot remove '${filename}': No such file or directory`;
		}

		// Remove from directory
		fileSystem[currentDir].splice(index, 1);

		// Remove content
		const fullPath = currentDir === "/" ? `/${filename}` : `${currentDir}/${filename}`;
		delete fileContents[fullPath];
		localStorage.setItem("fileContents", JSON.stringify(fileContents));

		return "";
	},

	touch: (args = []) => {
		if (args.length === 0) return "Usage: touch <filename>";
		const filename = args[0];

		if (filename.includes("/")) {
			return "touch: cannot create file with path separators";
		}

		const dirContents = fileSystem[currentDir] || [];
		if (dirContents.includes(filename)) {
			return ""; // File already exists, just update timestamp (no-op here)
		}

		// Add file to directory
		if (!fileSystem[currentDir]) {
			fileSystem[currentDir] = [];
		}
		fileSystem[currentDir].push(filename);

		// Initialize empty content
		const fullPath = currentDir === "/" ? `/${filename}` : `${currentDir}/${filename}`;
		fileContents[fullPath] = "";
		localStorage.setItem("fileContents", JSON.stringify(fileContents));

		return "";
	},
	morse: (args = []) => {
		if (args.length === 0) return "Usage: morse <text>";
		const text = args.join(" ").toUpperCase();
		const morseCode: Record<string, string> = {
			A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
			H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
			O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
			V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
			"0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
			"5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
			" ": "/"
		};
		return text.split("").map(c => morseCode[c] || c).join(" ");
	},
	base64: (args = []) => {
		if (args.length < 2) return "Usage: base64 encode|decode <text>";
		const operation = args[0].toLowerCase();
		const text = args.slice(1).join(" ");

		try {
			if (operation === "encode") {
				return btoa(text);
			} else if (operation === "decode") {
				return atob(text);
			} else {
				return "Usage: base64 encode|decode <text>";
			}
		} catch (e) {
			return "Error: Invalid input for base64 operation";
		}
	},
	typewriter: (args = []) => {
		if (args.length === 0) return "Usage: typewriter <text>";
		const text = args.join(" ");
		const line = document.createElement('div');
		line.classList.add('terminal-line');
		outputContainer.appendChild(line);

		let i = 0;
		const interval = setInterval(() => {
			if (i < text.length) {
				line.textContent += text[i];
				term.scrollTop = term.scrollHeight;
				i++;
			} else {
				clearInterval(interval);
			}
		}, 50);

		return "";
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
welcome.classList.add('terminal-line');
term.insertBefore(welcome, outputContainer);

createPrompt();
