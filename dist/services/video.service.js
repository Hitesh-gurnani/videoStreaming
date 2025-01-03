"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideoForHLS = void 0;
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const resolutions = [
    { width: 1920, height: 1080, bitRate: 2000 },
    { width: 1280, height: 720, bitRate: 1000 },
    { width: 854, height: 480, bitRate: 500 },
    { width: 640, height: 360, bitRate: 400 },
];
const processVideoForHLS = (inputPath, outputPath, callback) => {
    fs_1.default.mkdirSync(outputPath, { recursive: true });
    const masterPlaylist = `${outputPath}/master.m3u8`;
    const masterContent = [];
    resolutions.forEach((resolution) => {
        const variantOutput = `${outputPath}/${resolution.height}p`;
        const variantPlaylist = `${variantOutput}/playlist.m3u8`;
        let countProcessings = 0;
        fs_1.default.mkdirSync(variantOutput, { recursive: true });
        (0, fluent_ffmpeg_1.default)(inputPath)
            .outputOptions([
            `-vf scale=w=${resolution.width}:h=${resolution.height}`,
            `-b:v ${resolution.bitRate}k`,
            "-hls_time 10",
            "-codec:v libx264",
            "-codec:a aac",
            "-hls_playlist_type vod",
            `-hls_segment_filename ${variantOutput}/segment%03d.ts`,
        ])
            .output(variantPlaylist)
            .on("end", () => {
            // when processing ends
            masterContent.push(`#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitRate}000,RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`);
            countProcessings += 1;
            if (countProcessings === resolutions.length) {
                console.log("processing done");
                console.log(masterContent);
                fs_1.default.writeFileSync(masterPlaylist, `#EXTM3U\n${masterContent.join("\n")}`);
                callback(null, masterPlaylist);
            }
        })
            .on("error", (error) => {
            console.log("error occured", error);
            callback(error);
        })
            .run();
    });
};
exports.processVideoForHLS = processVideoForHLS;
