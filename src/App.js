import { useState, useEffect, useCallback, useRef } from "react";

import Chat from "./components/chat";
import "./App.css";
import { abortWrapper } from "./utils/abort";

function App() {
  const reqRef = useRef(null);

  const [messageList, setMessageList] = useState([
    {
      msg: "您可以在下方输入文字或通过语音的形式将问题发送给我",
      type: "answer",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!currentMessage) {
      return;
    }

    const timer = setTimeout(() => {
      const str = currentMessage.msg.slice(0, 4);
      if (str.length < 4) {
        setCurrentMessage(null);
        clearTimeout(timer);
      }

      const newCurrentMessage = Object.assign({}, messageList[0], {
        msg: messageList[0].msg + str,
      });

      setCurrentMessage({
        type: "answer",
        msg: currentMessage.msg.substring(4),
      });

      setMessageList([
        newCurrentMessage,
        ...messageList.slice(1, messageList.length),
      ]);
    }, 35);

    return () => {
      clearTimeout(timer);
    };
  }, [messageList, currentMessage]);

  const onSend = async () => {
    setInputValue("");

    setMessageList([
      {
        msg: "正在努力生成中，请耐心等待",
        type: "answer",
        pending: true,
      },
      {
        msg: inputValue,
        type: "question",
      },
      ...messageList,
    ]);

    reqRef.current = abortWrapper(
      new Promise((resolve) => setTimeout(resolve, 800))
    );

    reqRef.current
      .then(() => {
        setMessageList((prevMessageList) => [
          { msg: "", type: "answer", pending: false },
          ...prevMessageList.slice(1, prevMessageList.length),
        ]);

        setCurrentMessage({
          msg: "GPL-3.0许可证允许商业使用。然而，在使用GPL-3.0许可的软件时，您需要遵守许可证的条款，其中包括对源代码的公开许可要求。如果您对基于GPL-3.0许可的软件进行了修改，并且对其进行了再分发或交付，则您需要提供修改后的源代码，并且这些源代码也必须使用GPL-3.0许可证。因此，如果您打算将GPL-3.0许可的软件用于商业目的，您需要确保您理解并遵守GPL-3.0许可证的规定，特别是在涉及再分发、修改和开放源代码方面的规定。",
          type: "answer",
        });
      })
      .catch((err) => err);
  };

  const stopGen = useCallback(() => {
    reqRef.current && reqRef.current.abort();

    setMessageList([...messageList.slice(1, messageList.length)]);
  }, [messageList]);

  return (
    <div className="App">
      <Chat setAborted={stopGen} messageList={messageList} />

      <div className="send-row">
        <input
          value={inputValue}
          type="text"
          className="send-input"
          onInput={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={() => onSend()}
          className={`send-button ${currentMessage && "disabled"}`}
        >
          发送
        </button>
      </div>
    </div>
  );
}

export default App;
