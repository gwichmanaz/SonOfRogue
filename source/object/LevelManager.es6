const Level = require('../class/Level.es6');
const Cell = require('../class/Cell.es6');
// Explicitly require level generators so Browserify will pull them in
const generators = {
	"Test": require('../class/LevelGeneratorTest.es6'),
	"Classic": require('../class/LevelGeneratorClassic.es6'),
};

module.exports	 = {
	generateLevelMap(levelType, mapSeed) {
		const generator = new generators[levelType];
		return generator.generateLevelMap(mapSeed);
	},

}
