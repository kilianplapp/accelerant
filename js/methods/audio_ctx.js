import { hash } from '../utils/hash.js'
var pxi_output;
var pxi_full_buffer;
export function run_pxi_fp() {
    try {
        if (context = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100), !context) {
            set_result("no_fp", "pxi_result");
            pxi_output = 0;
        }

        // Create oscillator
        pxi_oscillator = context.createOscillator();
        pxi_oscillator.type = "triangle";
        pxi_oscillator.frequency.value = 1e4;

        // Create and configure compressor
        pxi_compressor = context.createDynamicsCompressor();
        pxi_compressor.threshold && (pxi_compressor.threshold.value = -50);
        pxi_compressor.knee && (pxi_compressor.knee.value = 40);
        pxi_compressor.ratio && (pxi_compressor.ratio.value = 12);
        pxi_compressor.reduction && (pxi_compressor.reduction.value = -20);
        pxi_compressor.attack && (pxi_compressor.attack.value = 0);
        pxi_compressor.release && (pxi_compressor.release.value = .25);

        // Connect nodes
        pxi_oscillator.connect(pxi_compressor);
        pxi_compressor.connect(context.destination);

        // Start audio processing
        pxi_oscillator.start(0);
        context.startRendering();
        context.oncomplete = function (evnt) {
            pxi_output = 0;
            var sha1 = []
            for (var i = 0; i < evnt.renderedBuffer.length; i++) {
                sha1.push(evnt.renderedBuffer.getChannelData(0)[i].toString());
            }
            hash(sha1.join(',')).then(h => {
                pxi_full_buffer_hash = h
                //console.log(pxi_full_buffer_hash);
                for (var i = 4500; 5e3 > i; i++) {
                    pxi_output += Math.abs(evnt.renderedBuffer.getChannelData(0)[i]);
                }
                x = pxi_output.toString()
                pxi_compressor.disconnect();
                return {"hash": pxi_full_buffer_hash, "value": x, "name": "pxi"};
            })
            
        }
    } catch (u) {
        pxi_output = 0;
        return false;
    }
}
