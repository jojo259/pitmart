export function relativeTimestamp(timeString: Date): string {
	const curTime = new Date();

	let theTime: Date = new Date(timeString);

	let timeDiff = Math.abs(theTime.getTime() - curTime.getTime());

	let timeWord = '';

	if (timeDiff < 1000) {
		return 'right now';
	} else if (timeDiff < 60000) {
		timeWord = 'second';
		timeDiff /= 1000;
	} else if (timeDiff < 3600000) {
		timeWord = 'minute';
		timeDiff /= 60000;
	} else if (timeDiff < 86400000) {
		timeWord = 'hour';
		timeDiff /= 3600000;
	} else if (timeDiff < 2678400000) {
		timeWord = 'day';
		timeDiff /= 86400000;
	} else if (timeDiff < 31536000000) {
		timeWord = 'month';
		timeDiff /= 2678400000;
	} else {
		timeWord = 'year';
		timeDiff /= 31536000000;
	}

	timeDiff = Math.floor(timeDiff);

	if (timeDiff > 1) {
		timeWord += 's';
	}

	if (theTime.getTime() > curTime.getTime()) {
		return `in ${timeDiff} ${timeWord}`;
	} else {
		return `${timeDiff} ${timeWord} ago`;
	}
}
