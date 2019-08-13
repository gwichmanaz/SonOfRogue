{
	// BEEP BOX STUFF
	let beepbox = require("../lib/beepbox_synth.js");
	let bb_themes = {
		explore: "7n31s7k0l00e08t1Um0a7g0fj7i0r1o3210T0v0u00q1d1f6y0z1C2w2c0h3T0v0u00q1d1f6y0z1C2w2c0h5T0v0u00q1d1f3y0z1C2w2c0h0T2v0u02q0d1fay0z1C2w1b4h4h4h4h4h4i4x8i4h4h4h4h8N514h4h4h4h4h4h4h4p21fCKDnH3N41f2QQvl1BPMKKwOMaqfW2wo6CAX-CR_2ZdvNy9vAshbYz9bYyDR_YI_aJJI2DFd1elEAVk0",
		battle: "7n31s7k0l00e0ft2cm0a7g0fj7i0r1o2430T0v0u00q1d1f6y0z1C2w7c0h5T0v0u00q1d1f6y0z1C2w2c0h0T0v0u00q1d1f6y0z1C2w5c0h0T2v0u02q0d1fay0z1C2w1b024x8i4x8i404h4h4h4h4h8i4x8i4x8i8x4h4h4h4h4p235FBMqa90LAqa90LHEEHbWWaaO_phh85Yxhh85Zt55pvnhhmnwkQvp79As2hM97mhRAtp7mhwaptw8W2ewFE5E5E5wiewzEaq1q1q1s0hQ4t1jgbgbgbihQ4t1jgbgbga1jhwapg6ywmyywmyyyyyz9Oqa1qaa1qaaaaad0J550J550J5555550J550J550J5555500",
	};
	let bb_synths = {
	};
	let bb_activeSynth;

	/**
	 * play the theme using a beepbox synthesizer
	 * TODO: loop vs. once
	 */
	function beepboxPlayer(theme, loop) {
		// lazy-init a synthesizer
		console.log("BeepBox Playing", theme);
		bb_synths[theme] = bb_synths[theme] || new beepbox.Synth(bb_themes[theme]);
		if (loop) {
			// we can overlap other sounds, but only one loop playing at a time please
			if (bb_activeSynth) {
				if (bb_activeSynth == bb_syths[theme]) {
					// we are already playing the theme we want to play
					return;
				}
				bb_activeSynth.pause();
			}
			bb_activeSynth = theme && bb_synths[theme];
		}
		theme && bb_synths[theme].play();
	}

	// WEB AUDIO (MP3) SUTFF
	let AudioContext = window.AudioContext || window.webkitAudioContext;
	let webAudioContext = AudioContext && new AudioContext();
	// TODO: handle case where we fail to create an audio context; don't expect this to ever happen

	let mp3_themes = {
		explore: "asset/Music/Cave_1.mp3",
		battle: "asset/Music/Battle_1.mp3"
	};
	let mp3_promises = {
	};
	let mp3_activeNode = null, mp3_activeTheme = null;

	/**
	 * given a URL to an audio file, return a promise that resolves with the decoded audio buffer
	 */
	function loadAudioFile(theme) {
		var url = mp3_themes[theme];
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		// TODO: don't assume that all of this succeeds
		return new Promise((resolve, reject) => {
			request.onload = () => {
				webAudioContext.decodeAudioData(request.response, resolve);
			};
			request.send();
		});
	}

	/**
	 * start loading up all our MP3s
	 * TODO: don't assume we will need them all, pre-load commonly used ones and let the rest get lazy loaded
	 */
	function mp3LoadAllThemes() {
		Object.keys(mp3_themes).forEach((theme) => {
			mp3_promises[theme] = loadAudioFile(theme);
		});
	}

	function mp3Player(theme, loop) {
		console.log("start playing", theme, loop);

		if (loop) {
			if (theme == mp3_activeTheme) {
				// We are already looping on what they ask for, just keep playing
				console.log("Already playing", theme);
				return;
			}
			// Stop playing the old theme, and clear references
			mp3_activeNode && mp3_activeNode.stop();
			mp3_activeNode = mp3_activeTheme = null;
		}

		// You can pass in a null theme to stop any existing loop
		if (!theme) {
			return;
		}

		mp3_promises[theme] = mp3_promises[theme] || loadAudioFile(theme);
		mp3_promises[theme].then((buffer) => {
			// Create the node to play this theme.  Create a new node each time because once a node is stopped it cannot be restarted
			console.log("Creating node for", theme);
			var node = webAudioContext.createBufferSource();
			node.buffer = buffer;
			node.connect(webAudioContext.destination);
			if (loop) {
				node.loop = true;
				mp3_activeNode = node;
				mp3_activeTheme = theme;
			}
			node.start(0);
			console.log("After node start", webAudioContext.state);
			// NOTE: we did not necessarily really start, if there was no gesture on the call stack
			// If we didn't start, then act like we stopped.
			// It would be nice if JS just gave us an easy way to see if there's a gesture on the call stack
			if (webAudioContext.state != "running") {
				mp3_activeNode = mp3_activeTheme = null;
			}
		});
	}

	function noPlayer(theme, loop) {
		//console.log("No sound player selected");
	}

	let player = noPlayer;

	module.exports = {
		/**
		 * @return Promise that resolves when sound manager is ready
		 *
		 * NOTE: for a game on web site to make sound, there MUST be a user gesture event on the call stack, i.e. starting
		 * a sound must be in response to a user-action.
		 */
		init() {
			player = mp3Player; // TODO: choose player based on config, if we get BeepBox to not destroy the speakers :)
			mp3LoadAllThemes();
			// For now, just resolve.  In future, Maybe want to wait until some particular sound files are loaded?
			return Promise.resolve();
		},
		/**
		 * play a sound, either once or in a continuous loop.
		 * @theme {String} the name of the sound (generally corresponds to its purpose)
		 * @loop {boolean} true to play continuously
		 * this function is just a façade that passes the arguments on to our chosen player
		 */
		play(theme, loop) {
			player(theme, loop);
		},
		setGame(game) {
			this.game = game;
			this.event = game.event;
			this.event.on("heroMoving", () => {
				this.play("explore", true);
			});
		},
		masterSwitch(onOff) {
			// TODO: choose player based on config, if we get BeepBox to not destroy the speakers :)
			console.log("setting sound player based on masterSwitch", onOff);

			// Stop any sound that might already be playing
			player(null, true);

			player = onOff ? mp3Player : noPlayer;
		}
	};
}
