import "./index.css";

function Message({ message, setAborted }) {
  return (
    <>
      <div className={`message message-${message.type}`}>{message.msg}</div>
      {message.pending && (
        <span className="message-answer_pending" onClick={setAborted}>
          停止生成
        </span>
      )}
    </>
  );
}

export default Message;
