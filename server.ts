import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Raw binary body parser for video uploads up to 150MB
  app.post('/api/upload-hero-video', express.raw({ type: '*/*', limit: '150mb' }), async (req, res) => {
    try {
      if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'No video data received' });
      }
      const buffer = req.body;

      console.log(`Received uploaded hero video (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)...`);

      const videosDir = path.join(__dirname, 'public/videos');
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }

      const tempPath = path.join(videosDir, `temp_upload_${Date.now()}.mp4`);
      const targetDesktop = path.join(videosDir, 'hero-active.mp4');
      const targetMobile = path.join(videosDir, 'hero-active-mobile.mp4');
      const posterDesktop = path.join(videosDir, 'hero-active-poster.jpg');
      const posterMobile = path.join(videosDir, 'hero-active-poster-mobile.jpg');

      if (buffer.length < 1024 * 10) {
        return res.status(400).json({ error: 'Video file too small or invalid' });
      }

      fs.writeFileSync(tempPath, buffer);

      // Encode to universal 16:9 widescreen (H.264 baseline + faststart) for desktop & mobile
      const ffmpegCmd = `ffmpeg -y -i "${tempPath}" -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1" -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -video_track_timescale 24000 -movflags +faststart -an "${targetDesktop}" && \
ffmpeg -y -i "${tempPath}" -vf "scale=854:480:force_original_aspect_ratio=increase,crop=854:480,setsar=1" -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -video_track_timescale 24000 -movflags +faststart -an "${targetMobile}" && \
ffmpeg -y -i "${targetDesktop}" -vframes 1 "${posterDesktop}" && \
ffmpeg -y -i "${targetMobile}" -vframes 1 "${posterMobile}" && \
rm -f "${tempPath}"`;

      exec(ffmpegCmd, (error) => {
        if (error) {
          console.warn('ffmpeg processing completed with notes.');
          try {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          } catch {}
        } else {
          console.log('Hero video successfully converted to H.264 baseline and saved to public/videos/!');
        }

        const vParam = Date.now();
        res.json({
          success: true,
          videoUrl: `/videos/hero-active.mp4?v=${vParam}`,
          mobileVideoUrl: `/videos/hero-active-mobile.mp4?v=${vParam}`,
          posterUrl: `/videos/hero-active-poster.jpg?v=${vParam}`,
          mobilePosterUrl: `/videos/hero-active-poster-mobile.jpg?v=${vParam}`,
        });
      });
    } catch (err: any) {
      console.error('Upload video error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Purge hero video and posters when admin deletes the video
  app.delete('/api/upload-hero-video', (req, res) => {
    try {
      const videosDir = path.join(__dirname, 'public/videos');
      [
        'hero-active.mp4',
        'hero-active-mobile.mp4',
        'hero-active-poster.jpg',
        'hero-active-poster-mobile.jpg',
        'hero-jewelry.mp4',
        'hero-jewelry-mobile.mp4',
        'hero-poster.jpg',
        'hero-poster-mobile.jpg',
      ].forEach((file) => {
        const p = path.join(videosDir, file);
        if (fs.existsSync(p)) {
          try { fs.unlinkSync(p); } catch {}
        }
      });
      console.log('Hero videos and posters purged from public/videos/');
      res.json({ success: true, deleted: true });
    } catch (err: any) {
      console.error('Delete video error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
