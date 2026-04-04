const Replicate = require('replicate');

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
      'natural': 'professionally restored natural wood door, rich grain visible, clear protective coating, like new condition',
      'dark-stain': 'dark mahogany stained wood door, deep rich brown color, glossy finish, elegant appearance',
      'medium-stain': 'medium oak stained wood door, warm brown tones, smooth finish, classic look',
      'light-stain': 'light cherry stained wood door, warm amber tones, natural grain visible, fresh finish',
      'paint-white': 'freshly painted white door, smooth satin finish, clean modern look',
      'paint-black': 'modern black painted door, sleek smooth finish, contemporary style',
      'paint-custom': 'freshly painted door, smooth professional finish, vibrant clean color'
    };

    const prompt = `A beautiful ${prompts[finishType] || prompts.natural}, professional photography, high quality, detailed, well-lit, residential entrance`;

    const output = await replicate.run(
      "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
      {
        input: {
          image: imageData,
          prompt,
          negative_prompt: "blurry, low quality, distorted, damaged, ugly, poor lighting",
          num_inference_steps: 30,
          image_guidance_scale: 1.5,
          guidance_scale: 7.5,
        }
      }
    );

    const previewUrl = Array.isArray(output) ? output[0] : output;
    return res.status(200).json({ success: true, previewUrl });

  } catch (error) {
    console.error('Replicate error:', error);
    return res.status(500).json({ error: 'Failed to generate preview', details: error.message });
  }
}
