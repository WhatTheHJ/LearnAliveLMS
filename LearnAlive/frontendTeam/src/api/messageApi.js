import axios from 'axios';

const API_URL = 'http://localhost:8080/api/messages';

// 쪽지 보내기
export const sendMessage = async (messageData) => {
  console.log('보내는 데이터:', messageData); // 확인용 로그 추가
  return await axios.post(`${API_URL}/send`, messageData);
};

// 쪽지 상세보기
export const getMessageById = async (messageId) => {
  const response = await axios.get(`${API_URL}/${messageId}`);
  return response.data;
};

// 받은 쪽지 목록
export const getReceivedMessages = async (receiverId) => {
  const response = await axios.get(`${API_URL}/received/${receiverId}`);
  return response.data;
};

// 보낸 쪽지 목록
export const getSentMessages = async (senderId) => {
  const response = await axios.get(`${API_URL}/sent/${senderId}`);
  return response.data;
};

// 읽음 처리
export const markAsRead = async (messageId) => {
  return await axios.put(`${API_URL}/read/${messageId}`);
};

// 쪽지 삭제
export const deleteMessage = async (messageId) => {
  return await axios.delete(`${API_URL}/delete/${messageId}`);
};

// 주소록 조회
export const getAddressBook = async () => {
  const response = await axios.get(`${API_URL}/addressBook`);
  return response.data;
};
