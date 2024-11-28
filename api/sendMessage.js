import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只允許 POST 請求' });
    }

    const { message } = req.body;
    const CHATBOT_ID = process.env.CHATBOT_ID;
    const API_KEY = process.env.API_KEY;
    const API_URL = 'https://www.chatbase.co/api/v1/chat';

    console.log("CHATBOT_ID:", CHATBOT_ID);
    console.log("API_KEY:", API_KEY ? "存在" : "未定義");

    try {
        if (!CHATBOT_ID || !API_KEY) {
            throw new Error('環境變數 CHATBOT_ID 或 API_KEY 未設置');
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatbotId: CHATBOT_ID,
                messages: [{ content: message, role: 'user' }],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Chatbase API 錯誤:', errorData);
            throw new Error(errorData.message || 'Chatbase API 回應失敗');
        }

        const data = await response.json();
        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('處理請求時發生錯誤：', error.message);
        res.status(500).json({ error: '無法處理請求', details: error.message });
    }
}

