// Dummy notification system for sending alerts
export const sendNotification = (title, message) => {
  console.log(`[Notification] ${title}: ${message}`);
  // You can replace this with a real notification system, e.g., FCM or email
};
