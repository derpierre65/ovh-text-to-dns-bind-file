const fs = require('fs');

(async () => {
	let ovhText = '';
	try {
		ovhText = fs.readFileSync('input.txt').toString();
	}
	catch (error) {
		throw new Error('Failed to read ovh.txt');
	}

	const dnsEntries = {};
	const ovhTextLines = ovhText.split('\n');
	const mainDomain = ovhTextLines[0];
	for (const line of ovhTextLines) {
		// ignore lines without " IN "
		if (!line.includes(' IN ')) {
			continue;
		}

		const normalizedLine = line.replace(/ {2,}/ig, ' ');
		const split = normalizedLine.split(' ');

		const dnsEntry = {
			domain: null,
			ttl: null,
			type: null,
			target: null,
		};

		for (let i = 0; i < split.length; i++) {
			const value = split[i];
			if (dnsEntry.domain === null) {
				dnsEntry.domain = (value ? value + '.' + mainDomain : mainDomain) + '.';
				continue;
			}
			if (dnsEntry.ttl === null && !isNaN(parseInt(value))) {
				dnsEntry.ttl = value / 60;
				continue;
			}
			if (value === 'IN') {
				dnsEntry.type = split[++i];
			}
			if (dnsEntry.type !== null) {
				let target = split.slice(i + 1).join(' ');

				if (target.indexOf('(') === 0) {
					target = target.slice(1, -1).trim();
					const split = target.split('"');
					target = `"${split.map(value => value.trim()).join('')}"`;
				}

				dnsEntry.target = target;
				break;
			}
		}

		dnsEntry.ttl = 5;

		if (typeof dnsEntries[dnsEntry.type] === 'undefined') {
			dnsEntries[dnsEntry.type] = [];
		}

		dnsEntries[dnsEntry.type].push(dnsEntry);
	}

	const bindFile = [];
	for (const type of Object.keys(dnsEntries)) {
		bindFile.push(`;${type} records`);
		for (const row of dnsEntries[type]) {
			bindFile.push([
				row.domain,
				'IN',
				row.ttl + 'm',
				type,
				row.target,
			].join('\t'));
		}

		bindFile.push('');
	}

	fs.writeFileSync(mainDomain + '.bind', bindFile.join('\n'));
})();