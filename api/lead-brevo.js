import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const email = req.body?.contact?.email || req.body?.email;

  if (!email) {
    return res.status(400).json({ error: 'Email não encontrado no body' });
  }

  try {
    const apiToken = process.env.PIPEDRIVE_API_KEY;
    const pipelineId = process.env.PIPELINE_ID;
    const stageId = process.env.STAGE_ID;

    const personRes = await axios.post(
      `https://api.pipedrive.com/v1/persons?api_token=${apiToken}`,
      {
        name: 'Lead Landing Page',
        email: email
      }
    );

    const personId = personRes.data.data.id;

    await axios.post(
      `https://api.pipedrive.com/v1/deals?api_token=${apiToken}`,
      {
        title: 'Simulação gratuita - Landing Page',
        person_id: personId,
        pipeline_id: pipelineId,
        stage_id: stageId
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Erro ao criar lead no Pipedrive' });
  }
}
