// API endpoint for generating AI door previews
// Deploy this to Vercel as a serverless function

const Replicate = require('replicate');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, finishType, conditionLevel } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Initialize Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Build prompt based on finish type
    const prompts = {
      'natural': 'professionally restored natural wood door, rich grain visible, clear protective coating, like new condition',
      'dark-stain': 'dark mahogany stained wood door, deep rich brown color, glossy finish, elegant appearance',
      'medium-stain': 'medium oak stained wood door, warm brown tones, smooth finish, classic look',
      'light-stain': 'light cherry stained wood door, warm amber tones, natural grain visible, fresh finish',
      'paint-white': 'freshly painted white door, smooth matte or satin finish, clean modern look',
      'paint-black': 'modern black painted door, sleek smooth finish, contemporary style',
      'paint-custom': 'freshly painted door, smooth professional finish, vibrant clean color'
    };

    const prompt = `A beautiful ${prompts[finishType] || prompts.natural}, professional photography, high quality, detailed, well-lit, residential entrance`;

    // Use Stable Diffusion img2img for realistic transformation
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          image: imageData, // Base64 or URL
          prompt: prompt,
          negative_prompt: "blurry, low quality, distorted, damaged, ugly, poor lighting, artificial, fake",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          strength: 0.6, // How much to transform (0.6 = moderate transformation)
          scheduler: "DPMSolverMultistep",
        }
      }
    );

    // Return the generated image URL
    return res.status(200).json({
      success: true,
      previewUrl: output[0],
      finishType,
      conditionLevel
    });

  } catch (error) {
    console.error('Error generating preview:', error);
    return res.status(500).json({
      error: 'Failed to generate preview',
      details: error.message
    });
  }
}
