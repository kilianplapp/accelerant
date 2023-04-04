const path = require('path');
var WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  entry: './js/index.mjs',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  experiments: {
    topLevelAwait: true
  },
  plugins: [
    new WebpackObfuscator ({
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: true,
            debugProtectionInterval: 0,
            disableConsoleOutput: false,
            domainLock: [],
            domainLockRedirectUrl: 'about:blank',
            forceTransformStrings: [],
            identifierNamesCache: null,
            identifierNamesGenerator: 'hexadecimal',
            identifiersDictionary: [],
            identifiersPrefix: '',
            ignoreImports: false,
            inputFileName: '',
            log: false,
            numbersToExpressions: false,
            optionsPreset: 'default',
            renameGlobals: true,
            renameProperties: false,
            renamePropertiesMode: 'safe',
            reservedNames: [],
            reservedStrings: [],
            seed: 0,
            selfDefending: true,
            simplify: true,
            sourceMap: false,
            sourceMapBaseUrl: '',
            sourceMapFileName: '',
            sourceMapMode: 'separate',
            sourceMapSourcesMode: 'sources-content',
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayCallsTransformThreshold: 0.5,
            stringArrayEncoding: [],
            stringArrayIndexesType: [
                'hexadecimal-number'
            ],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: 'variable',
            stringArrayThreshold: 0.75,
            target: 'browser',
            transformObjectKeys: true,
            unicodeEscapeSequence: true
    }, [])
]
};
