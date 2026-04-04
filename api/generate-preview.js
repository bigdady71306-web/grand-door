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
      'natural': 'make it a professionally restored natural wood door with rich grain and clear protective coating',
      'dark-stain': 'make it a dark mahogany stained wood door with deep rich brown color and glossy finish',
      'medium-stain': 'make it a medium oak stained wood door with warm brown tones and smooth finish',
      'light-stain': 'make it a light cherry stained wood door with warm amber tones',
      'paint-white': 'make it a freshly painted white door with smooth satin finish',
      'paint-black': 'make it a modern black painted door with sleek smooth finish',
      'paint-custom': 'make it a freshly painted door with smooth professional finish'
    };

    const prompt = prompts[finishType] || prompts.natural;

    // Upload image to Replicate file storage
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    const fileResponse = await fetch('https://api.replicate.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': imageBuffer.length,
      },
      body: imageBuffer,
    });
    
    const fileData = await fileResponse.json();
    const imageUrl = fileData.urls?.get || fileData.url;

    if (!imageUrl) throw new Error('Failed to upload image: ' + JSON.stringify(fileData));

    const output = await replicate.run(
      "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
      {
        input: {
          image: imageUrl,
          prompt,
          negative_prompt: "blurry, low quality, distorted, damaged, ugly",
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
