import Toastify from 'toastify-js';

/**
 * Using Toastify, messages will be shown to user on the visited page if needed
 */
const ContentMessage = {
  showMessage(text, type = 'success') {
    // only run in content script, otherwise no-op
    if (typeof document === 'undefined') {
      return;
    }
    const style =
      type === 'success'
        ? { background: '#29ab87', color: 'white' }
        : { background: '#991b1b', color: 'white' };

    Toastify({
      text,
      duration: type === 'success' ? 5000 : 15000,
      newWindow: true,
      close: true,
      gravity: 'bottom', // `top` or `bottom`
      position: 'left', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: { ...style },
      onClick() {
        console.log('clicked!');
      }, // Callback after click
    }).showToast();
  },
};

export default ContentMessage;
