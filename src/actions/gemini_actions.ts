export async function geminiChat(data: {
    message: string;
    files: File[];
    chatId?: string
  }): Promise<{
    stream: AsyncGenerator<{ type: string; content: string; fileName?: string }>;
    fileUrls: string[];
  }> {
    const formData = new FormData();
    formData.append("message", data.message);
    formData.append("chatId", data.chatId || "");
    data.files.forEach((file) => {
      formData.append("files", file); // Use same key for multiple files
    });
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gemini/chat`, {
      method: "POST",
      body: formData,
    });
  
    if (!response.body) {
      throw new Error("No response body");
    }
  
    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let buffer = "";
    const fileUrls: string[] = [];
  
    async function* parseStream() {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
  
        for (let i = 0; i < parts.length - 1; i++) {
          const line = parts[i].trim();
          if (line.startsWith("data:")) {
            const jsonStr = line.slice(5).trim();
            try {
              const payload = JSON.parse(jsonStr);
  
              if (payload.type === "text") {
                yield { type: "text", content: payload.content };
              } else if (payload.type === "done" && payload.fileUrls) {
                fileUrls.push(...payload.fileUrls);
              }
            } catch (err) {
              console.error("Failed to parse stream chunk", jsonStr, err);
            }
          }
        }
  
        buffer = parts[parts.length - 1];
      }
    }
  
    return {
      stream: parseStream(),
      fileUrls,
    };
  }
  