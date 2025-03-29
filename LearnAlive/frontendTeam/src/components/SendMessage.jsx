import React from "react";
import MessageModal from "./MessageModal";
import PropTypes from 'prop-types';

const SendMessage = ({ onSend }) => {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSend = (receiverId, content) => {
    onSend(receiverId, content); // 쪽지 보내기 API 호출
    closeModal(); // 보내기 후 모달 닫기
  };

  return (
    <div>
      <button onClick={openModal}>쪽지 보내기</button>
      
      {/* 쪽지 보내기 모달 */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSend={handleSend}
        actionType="send" // 쪽지 보내기 모드
      />
    </div>
  );
};

// PropTypes 설정
SendMessage.propTypes = {
  onSend: PropTypes.func.isRequired,  // onSend가 함수 형태여야 하며 필수로 전달되어야 함
};
export default SendMessage;
