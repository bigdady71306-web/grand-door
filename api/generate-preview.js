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

    // Upload to imgbb
    const base64Only = imageData.replace(/^data:image\/\w+;base64,/, '');
    
    const formData = new URLSearchParams();
    formData.append('image', base64Only);
    formData.append('expiration', '600'); // 10 min temp
    
    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadRes.json();
    
    if (!uploadData.success) throw new Error('Image upload failed: ' + JSON.stringify(uploadData));
    
    const imageUrl = uploadData.data.url;

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
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate preview', details: error.message });
  }
}
