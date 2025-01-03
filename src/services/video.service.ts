import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
interface Resolution {
  width: number;
  height: number;
  bitRate: number;
}

const resolutions: Resolution[] = [
  { width: 1920, height: 1080, bitRate: 2000 },
  { width: 1280, height: 720, bitRate: 1000 },
  { width: 854, height: 480, bitRate: 500 },
  { width: 640, height: 360, bitRate: 400 },
];

export const processVideoForHLS = (
  inputPath: string,
  outputPath: string,
  callback: (error: Error | null, masterPlaylist?: string) => void
): void => {
  fs.mkdirSync(outputPath, { recursive: true });
  const masterPlaylist = `${outputPath}/master.m3u8`;
  const masterContent: string[] = [];

  resolutions.forEach((resolution) => {
    const variantOutput = `${outputPath}/${resolution.height}p`;
    const variantPlaylist = `${variantOutput}/playlist.m3u8`;
    let countProcessings = 0;

    fs.mkdirSync(variantOutput, { recursive: true });

    ffmpeg(inputPath)
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
        masterContent.push(
          `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitRate}000,RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`
        );
        countProcessings += 1;
        if (countProcessings === resolutions.length) {
          console.log("processing done");
          console.log(masterContent);
          fs.writeFileSync(
            masterPlaylist,
            `#EXTM3U\n${masterContent.join("\n")}`
          );
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
