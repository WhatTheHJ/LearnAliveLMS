import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";
import { useNotifications } from "../context/NotificationContext";

const NotificationListener = ({ userId }) => {
  const { addNotification } = useNotifications();
  console.log("🧪 NotificationListener 시작됨, userId:", userId);
  useEffect(() => {
    if (!userId )   {
        console.warn("❌ WebSocket 연결 생략 - userId 없음");
    return;
  }
    // toast.info("✅ 토스트 테스트 메시지!");
    const socket = new SockJS("http://localhost:8080/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      const topic = `/topic/user/${userId}`;
      console.log("📡 구독 주소:", topic);

      // ✅ class 채널 구독
      stompClient.subscribe(`/topic/user/${userId}`, (message) => {
       
        const data = JSON.parse(message.body);
        console.log("📥 수신된 알림:", data);
        addNotification(data); // 저장
        

        const time = new Date(data.createdAt).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        let emoji = "🔔";
        if (data.type === "POST") emoji = "📝";
        else if (data.type === "EXAM") emoji = "🧪";
        else if (data.type === "NOTICE") emoji = "📢";
        else if (data.type === "SURVEY") emoji = "📊";

        toast.info(`${emoji} ${data.title}\n📅 ${time}`, {
          position: "top-right",
          autoClose: 4000,
        });
      });


      // ✅ (선택) global 채널 구독 <subscribe는 반드시 온커넥트 내부에서!!!>
      stompClient.subscribe("/topic/global", (message) => {
        const data = JSON.parse(message.body);
        addNotification(data);
        toast.info(`📢 공지: ${data.title}`);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ WebSocket 오류:", frame);
    };

    stompClient.activate();
    return () => stompClient.deactivate();
  }, []);

  return null;
};

export default NotificationListener;