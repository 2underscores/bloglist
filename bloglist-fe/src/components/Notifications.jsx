import './Notifications.css';

function Notification(notif) {
  const msg = `${notif.type} - ${notif.message}`
  return (
    <div key={notif.id} className={`notification ${notif.type}`}>
      {msg}
    </div>)
}

function Notifications({ notifications }) {
  return (
    <div className="notificationContainer">
      {notifications.map(n => Notification(n))}
    </div>
  )
}

export default Notifications