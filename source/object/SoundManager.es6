{
	let beepbox = require("../lib/beepbox_synth.js");
	let bb_themes = {
		explore: "7n31s7k0l00e08t1Um0a7g0fj7i0r1o3210T0v0u00q1d1f6y0z1C2w2c0h3T0v0u00q1d1f6y0z1C2w2c0h5T0v0u00q1d1f3y0z1C2w2c0h0T2v0u02q0d1fay0z1C2w1b4h4h4h4h4h4i4x8i4h4h4h4h8N514h4h4h4h4h4h4h4p21fCKDnH3N41f2QQvl1BPMKKwOMaqfW2wo6CAX-CR_2ZdvNy9vAshbYz9bYyDR_YI_aJJI2DFd1elEAVk0",
		battle: "7n31s7k0l00e0ft2cm0a7g0fj7i0r1o2430T0v0u00q1d1f6y0z1C2w7c0h5T0v0u00q1d1f6y0z1C2w2c0h0T0v0u00q1d1f6y0z1C2w5c0h0T2v0u02q0d1fay0z1C2w1b024x8i4x8i404h4h4h4h4h8i4x8i4x8i8x4h4h4h4h4p235FBMqa90LAqa90LHEEHbWWaaO_phh85Yxhh85Zt55pvnhhmnwkQvp79As2hM97mhRAtp7mhwaptw8W2ewFE5E5E5wiewzEaq1q1q1s0hQ4t1jgbgbgbihQ4t1jgbgbga1jhwapg6ywmyywmyyyyyz9Oqa1qaa1qaaaaad0J550J550J5555550J550J550J5555500",
	};
	let bb_synths = {
	};
	let bb_activeSynth;
	module.exports = {
		/**
		 * @return Promise that resolves when sound manager is ready
		 *
		 * NOTE: for a game on web site to make sound, there MUST be a user gesture event on the call stack, i.e. starting
		 * a sound must be in response to a user-action.
		 */
		init() {
			// For now, we don't really need to do anything at init time
			return Promise.resolve();
		},
		/**
		 * play the theme using a beepbox synthesizer
		 * TODO: loop vs. once
		 */
		beepboxPlay(theme, loop) {
			// lazy-init a synthesizer
			bb_synths[theme] = bb_synths[theme] || new beepbox.Synth(bb_themes[theme]);
			if (loop) {
				// we can overlap other sounds, but only one loop playing at a time please
				if (bb_activeSynth) {
					bb_activeSynth.pause();
				}
				bb_activeSynth = bb_synths[theme];
			}
			bb_synths[theme].play();
		},
		play(theme, loop) {
			// TODO: based on "original" vs "demo" config, play MP3 files vs beepbox songs
			this.beepboxPlay(theme, loop);
		},
		setGame(game) {
			this.game = game;
			this.event = game.event;
			this.event.on("setDestination", () => {
				this.play("explore", true);
			});
		},
	};
}
