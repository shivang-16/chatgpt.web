"use server";

import { getCookie } from './get_cookie'; // Assuming getCookie is in the same directory

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

interface Chat {
  _id: string;
  heading: string;
  // Add other chat properties as needed
}

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  // Add other message properties as needed
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const token = await getCookie('token'); // Get token using getCookie action
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options?.headers,
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || 'An error occurred' };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function createChat(chatName: string): Promise<ApiResponse<Chat>> {
  return fetchApi<Chat>(`${API_BASE_URL}/api/chat/create`, {
    method: 'POST',
    body: JSON.stringify({ name: chatName }),
  });
}

export async function getChats(): Promise<ApiResponse<Chat[]>> {
  return fetchApi<Chat[]>(`${API_BASE_URL}/api/chat/get`);
}

export async function createChatMessage(chatId: string, content: string, role: 'user' | 'assistant', fileUrls?: string[]): Promise<ApiResponse<Message>> {
  return fetchApi<Message>(`${API_BASE_URL}/api/chat/messages/create`, {
    method: 'POST',
    body: JSON.stringify({ chatId, content, role, fileUrls }),
  });
}

export async function getChatMessages(chatId: string): Promise<ApiResponse<Message[]>> {
  return fetchApi<Message[]>(`${API_BASE_URL}/api/chat/messages/${chatId}`);
}