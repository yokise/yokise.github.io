export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Only POST requests are allowed" });
    }

    const { message } = req.body;
    const CHATBOT_ID = process.env.CHATBOT_ID;
    const API_KEY = process.env.API_KEY;
    const API_URL = "https://www.chatbase.co/api/v1/chat";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatbotId: CHATBOT_ID,
                messages: [{ content: message, role: "user" }],
                stream: false,
                temperature: 0.5,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "API 回應錯誤");
        }

        const data = await response.json();
        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error("處理錯誤：", error.message);
        res.status(500).json({ error: "無法處理請求" });
    }
}
