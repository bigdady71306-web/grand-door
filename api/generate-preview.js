const Replicate = require('replicate');
const https = require('https');
const http = require('http');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { imageData, finishType } = req.body;
    if (!imageData) return res.status(400).json({ error: 'No image provided' });

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

    const prompts = {
      'natural': 'professionally refinished front door only, rich natural wood grain, clear satin urethane coating, keep surrounding walls and house unchanged',
      'dark-stain': 'front door only refinished in dark mahogany stain, deep rich brown, glossy finish, keep surrounding walls and house unchanged',
      'medium-stain': 'front door only refinished in medium oak stain, warm brown tones, smooth finish, keep surrounding walls and house unchanged',
      'light-stain': 'front door only refinished in light cherry stain, warm amber tones, keep surrounding walls and house unchanged',
      'paint-white': 'front door only freshly painted bright white, smooth satin finish, keep surrounding walls and house unchanged',
      'paint-black': 'front door only painted modern matte black, sleek finish, keep surrounding walls and house unchanged',
      'paint-custom': 'front door only freshly painted, smooth professional finish, keep surrounding walls and house unchanged'
    };

    const prompt = prompts[finishType] || prompts.natural;

    // Upload to imgbb
    const base64Only = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    const imgbbRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `image=${encodeURIComponent(base64Only)}&expiration=600`,
      }
    );
    
    const imgbbData = await imgbbRes.json();
    if (!imgbbData.success) throw new Error('Upload failed: ' + JSON.stringify(imgbbData.error));
    
    const imageUrl = imgbbData.data.url;

    const output = await replicate.run(
      "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
      {
        input: {
          image: imageUrl,
          prompt,
          negative_prompt: "blurry, low quality, distorted, damaged, ugly",
          num_inference_steps: 30,
          image_guidance_scale: 2.5,
          guidance_scale: 9.0,
        }
      }
    );

    const previewUrl = Array.isArray(output) ? output[0] : output;
    return res.status(200).json({ success: true, previewUrl });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate preview', details: error.message });
  }
}
