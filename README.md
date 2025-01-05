# Backend with Express and TypeScript

## Features

- **Support Upload of Video**
- **Video Processing**
  - Process the uploaded video to generate different resolutions for serving later.
- **Adaptive Streaming**
- **Serve Video Chunk by Chunk**

## Video Processing Details

### HLS Protocol (Consumer Side)

- **HTTP Live Streaming (HLS)** enables adaptive bitrate streaming.
- The video is segmented into chunks, each represented as a `.ts` (Transport Stream) file.

### Key Components

1. **M3U8 File**  
   - Acts as a playlist file used by HLS to manage chunks.  
   - The client communicates with this file to stream the video.

2. **FFmpeg**  
   - A suite of tools for audio and video processing.

### HLS Configuration

- **hls_playlist_type**  
  - Defines the type of playlist: `video on demand` or `event`.

- **hls_time**  
  - Specifies the duration of each segment.

- **hls_segment_filename**  
  - Defines the naming convention for segment files.

### Master Playlist

- The main orchestrator that decides which resolution playlist to serve based on bandwidth.

#### Resolutions

- `1080.m3u8`
- `720.m3u8`
- `480.m3u8`
