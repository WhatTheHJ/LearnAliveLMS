import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import {
  sendMessage,
  getMessageById,
  getReceivedMessages,
  getSentMessages,
  markAsRead,
  deleteMessage,
  getAddressBook,
} from '../api/MessageApi';

import '../styles/MessageModal.css';

const MessageModal = ({ isOpen, onClose }) => {
  const { user } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  const [activeTab, setActiveTab] = useState('received'); // received, sent, write
  const [formData, setFormData] = useState({
    receiverId: '',
    receiverName: '',
    title: '',
    content: '',
  });
  const [addressBook, setAddressBook] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // 상세보기 메시지
  const [isDetailOpen, setIsDetailOpen] = useState(false); // 상세보기 모달 상태
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        const data = await getSentMessages(user.userId);
        console.log('보낸 쪽지 데이터:', data);

        // 데이터가 배열인지 확인
        if (Array.isArray(data)) {
          // 배열의 각 항목을 처리하여 null 값을 빈 문자열이나 기본값으로 설정
          const processedData = data.map((message) => ({
            ...message,
            senderName: message.senderName || '알 수 없음', // 기본값 설정
            receiverName: message.receiverName || '알 수 없음', // 기본값 설정
            sentAt: message.sentAt || '전송일 미정', // 기본값 설정
            isRead: message.read ?? false,
          }));

          setSentMessages(processedData);
        }
      } catch (error) {
        console.error('보낸 쪽지를 가져오는 데 실패했습니다:', error);
        setSentMessages([]); // 에러 발생 시 빈 배열로 설정
      }
    };
    fetchSentMessages();
  }, [activeTab, user.userId]);

  useEffect(() => {
    const fetchReceivedMessages = async () => {
      try {
        const data = await getReceivedMessages(user.userId);
        console.log('받은 쪽지 데이터:', data);

        // 데이터가 배열인지 확인
        if (Array.isArray(data)) {
          const processedData = data.map((message) => ({
            ...message,
            senderName:
              message.senderName && message.senderId
                ? `${message.senderName}(${message.senderId})`
                : '알 수 없음', // 기본값 설정
            receiverName: message.receiverName || '알 수 없음', // 기본값 설정
            sentAt: message.sentAt || '전송일 미정', // 기본값 설정
            isRead: message.read ?? false,
          }));

          setReceivedMessages(processedData);
        }
      } catch (error) {
        console.error('받은 쪽지를 가져오는 데 실패했습니다:', error);
        setReceivedMessages([]); // 에러 발생 시 빈 배열로 설정
      }
    };
    fetchReceivedMessages();
  }, [activeTab, user.userId]);

  // 주소록 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchAddressBook = async () => {
      try {
        const data = await getAddressBook(); // API 호출하여 주소록 가져오기
        setAddressBook(data); // 주소록 상태에 저장
      } catch (error) {
        console.error('주소록 데이터를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchAddressBook();
  }, []); // 컴포넌트가 처음 렌더링 될 때만 실행

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleViewMessage = async (messageId, isRead) => {
    try {
      const message = await getMessageById(messageId);
      setSelectedMessage(message);
      setIsDetailOpen(true); // 상세보기 모달 열기

      // 안 읽은 쪽지는 읽음 처리
      if (!isRead) {
        await markAsRead(messageId);
        setReceivedMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === messageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('메시지를 불러오는 데 실패했습니다:', error);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedMessage(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async () => {
    const newMessage = {
      messageId: 0,
      senderId: user.userId,
      senderName: user.username,
      receiverId: formData.receiverId,
      receiverName: formData.receiverName,
      title: formData.title,
      content: formData.content,
      sentAt: new Date().toISOString(),
      isRead: false,
    };

    try {
      await sendMessage(newMessage);
      setActiveTab('sent'); // ✅ 메시지 전송 후 보낸 메시지함으로 이동
    } catch (error) {
      console.error('메시지 전송에 실패했습니다:', error);
    }
  };

  const handleSelectReceiver = (receiverId, receiverName) => {
    // '이름(아이디)' 형태로 변경하여 receiverName을 설정
    setFormData({
      ...formData,
      receiverId,
      receiverName: `${receiverName}(${receiverId})`,
    });
    handleTabClick('write'); // 주소록에서 선택하면 쪽지 작성 탭으로 돌아감
  };

  // 개별 체크박스 선택
  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  // 전체 선택 토글
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMessages([]);
    } else {
      const allMessageIds = (
        activeTab === 'received' ? receivedMessages : sentMessages
      ).map((msg) => msg.messageId);
      setSelectedMessages(allMessageIds);
    }
    setSelectAll(!selectAll);
  };

  // 선택된 메시지 삭제
  const handleDeleteSelectedMessages = async () => {
    try {
      await Promise.all(selectedMessages.map((id) => deleteMessage(id)));
      setSelectedMessages([]);

      // 삭제 후 목록 갱신
      if (activeTab === 'received') {
        setReceivedMessages((prev) =>
          prev.filter((msg) => !selectedMessages.includes(msg.messageId))
        );
      } else {
        setSentMessages((prev) =>
          prev.filter((msg) => !selectedMessages.includes(msg.messageId))
        );
      }
    } catch (error) {
      console.error('쪽지 삭제 실패:', error);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="overlay-1">
      <div className="modal-1">
        <h3>
          {activeTab === 'received'
            ? '받은 쪽지'
            : activeTab === 'sent'
            ? '보낸 쪽지'
            : '쪽지 보내기'}
        </h3>

        {activeTab !== 'write' && (
          <div className="tabs">
            <button
              className={activeTab === 'received' ? 'activeTab' : 'tab'}
              onClick={() => handleTabClick('received')}
            >
              받은 쪽지
            </button>
            <button
              className={activeTab === 'sent' ? 'activeTab' : 'tab'}
              onClick={() => handleTabClick('sent')}
            >
              보낸 쪽지
            </button>
          </div>
        )}

        {activeTab === 'write' ? (
          <div>
            <div className="addressBookButtonContainer">
              <button
                onClick={() => handleTabClick('addressBook')}
                className="addressBookButton"
              >
                주소록
              </button>
            </div>
            <input
              type="text"
              name="receiverId"
              placeholder="받는 사람"
              value={formData.receiverName}
              onChange={handleChange}
              className="input"
              readOnly
            />
            <input
              type="text"
              name="title"
              placeholder="제목"
              value={formData.title}
              onChange={handleChange}
              className="input"
            />
            <textarea
              name="content"
              placeholder="내용"
              value={formData.content}
              onChange={handleChange}
              className="textarea"
            />
            <button onClick={handleSendMessage} className="sendButton">
              보내기
            </button>
            <button
              onClick={() => handleTabClick('received')}
              className="cancelButton"
            >
              취소
            </button>
          </div>
        ) : activeTab === 'addressBook' ? (
          <div className="addressBookModal">
            <h4>주소록</h4>
            {addressBook.length === 0 ? (
              <p>주소록에 등록된 사람이 없습니다.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>아이디</th>
                  </tr>
                </thead>
                <tbody>
                  {addressBook.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => handleSelectReceiver(user.id, user.name)}
                    >
                      <td className="addressBookName">{user.name}</td>
                      <td>{user.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              onClick={() => handleTabClick('write')}
              className="closeAddressBookButton"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => handleTabClick('write')}
              className="writeButton"
            >
              쪽지 보내기
            </button>
            <button
              className="deleteButton"
              onClick={handleDeleteSelectedMessages}
              disabled={selectedMessages.length === 0}
            >
              선택 삭제
            </button>

            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input
                      className="checkbox"
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>
                    {activeTab === 'received' ? '보낸 사람' : '받는 사람'}
                  </th>
                  <th>제목</th>
                  <th>날짜</th>
                  <th>읽음 상태</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'received'
                  ? receivedMessages
                  : sentMessages
                ).map((message) => (
                  <tr key={message.messageId}>
                    <td>
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={selectedMessages.includes(message.messageId)}
                        onChange={() => handleSelectMessage(message.messageId)}
                      />
                    </td>
                    <td>
                      {activeTab === 'received'
                        ? message.senderName
                        : message.receiverName}
                    </td>
                    <td>
                      <button
                        className="messageTitle"
                        onClick={() =>
                          handleViewMessage(message.messageId, message.isRead)
                        }
                      >
                        {message.title}
                      </button>
                    </td>
                    <td>{new Date(message.sentAt).toLocaleString()}</td>
                    <td>{message.isRead ? '✅ 읽음' : '읽지 않음'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <button onClick={onClose} className="closeButton">
          닫기
        </button>
      </div>
      {/* 쪽지 상세보기 모달 */}
      {isDetailOpen && selectedMessage && (
        <div className="overlay-2">
          <div className="modal-2">
            <h3 className="modalTitle">📩 쪽지 상세보기</h3>
            <div className="messageInfo">
              <p>
                <strong>보낸 사람:</strong> {selectedMessage.senderName}
              </p>
              <p>
                <strong>받는 사람:</strong> {selectedMessage.receiverName}
              </p>
              <p>
                <strong>보낸 날짜:</strong>{' '}
                {new Date(selectedMessage.sentAt).toLocaleString()}
              </p>
            </div>
            <h4>제목:</h4>
            <div className="messageBox titleBox">{selectedMessage.title}</div>
            <h4>내용:</h4>
            <div className="messageBox contentBox">
              <div>{selectedMessage.content}</div>
            </div>
            <button onClick={handleCloseDetail} className="closeButton">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

MessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      messageId: PropTypes.number.isRequired, // message_id가 숫자형임을 반영
      senderName: PropTypes.string.isRequired,
      receiverName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      sentAt: PropTypes.string.isRequired,
      isRead: PropTypes.bool.isRequired,
      type: PropTypes.oneOf(['received', 'sent']).isRequired,
    })
  ).isRequired,
};

export default MessageModal;
