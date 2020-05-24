let timerObj = {
	minutes: 0,
	seconds: 0,
	timerId: 0
};

function soundAlarm() {
	let amount = 3;
	let audio = new Audio('Timer_Sound_Effect.mp3');

	function playSound() {
		audio.pause();
		audio.currentTime = 0;
		audio.play();
	}

	for (let i = 0; i < amount; i++) {
		setTimeout(playSound, 1200 * i);
	}
}

function updateValue(key, value) {
	value = value < 0 ? 0 : parseInt(value);
	value = value > 59 ? 59 : parseInt(value);

	if (key === 'seconds') {
		if (value < 10) {
			value = '0' + value;
		}
	}

	$('#' + key).html(value || 0);
	timerObj[key] = value;
}

(function detectChanges(key) {
	let input = '#' + key + '-input';

	$(input).change(function() {
		updateValue(key, $(input).val());
	});

	$(input).keyup(function() {
		updateValue(key, $(input).val());
	});
	return arguments.callee;
})('minutes')('seconds');

function startTimer() {
	buttonManager([ 'start', false ], [ 'pause', true ], [ 'stop', true ]);
	freezeInputs();

	timerObj.timerId = setInterval(function() {
		timerObj.seconds--;
		if (timerObj.seconds < 0) {
			if (timerObj.minutes === 0) {
				soundAlarm();
				return stopTimer();
			}
			timerObj.seconds = 59;
			timerObj.minutes--;
		}

		updateValue('minutes', timerObj.minutes);
		updateValue('seconds', timerObj.seconds);
	}, 1000);
}
function stopTimer() {
	clearInterval(timerObj.timerId);
	updateValue('minutes', $('#minutes-input').val());
	updateValue('seconds', $('#seconds-input').val());
	buttonManager([ 'start', true ], [ 'pause', false ], [ 'stop', false ]);
	unFreezeInputs();
}
function pauseTimer() {
	buttonManager([ 'start', true ], [ 'pause', false ], [ 'stop', true ]);
	clearInterval(timerObj.timerId);
}

function buttonManager(...buttonsArray) {
	buttonsArray.forEach((button) => {
		let buttonId = '#' + button[0] + '-button';
		if (button[1]) {
			$(buttonId).removeAttr('disabled');
		} else {
			$(buttonId).attr('disabled', 'disabled');
		}
	});
}

function freezeInputs() {
	$('#minutes-input').attr('disabled', 'disabled');
	$('#seconds-input').attr('disabled', 'disabled');
}

function unFreezeInputs() {
	$('#minutes-input').removeAttr('disabled');
	$('#seconds-input').removeAttr('disabled');
}
/*Test */
