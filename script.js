document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử HTML cần thiết
  const startScreen = document.getElementById("start-screen");
  const mainContent = document.getElementById("main-content");
  const backgroundMusic = document.getElementById("background-music");
  const messageElement = document.getElementById("current-message");
  const questionBox = document.getElementById("question-box");
  const questionTextElement = document.querySelector(".question");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const successMessage = document.getElementById("success-message");
  const container = document.querySelector(".container");
  const musicToggleButton = document.getElementById("music-toggle-btn"); // Nút nhạc

  // Danh sách các lời nhắn
  const messages = [
    "Sơ Ri ơi...",
    "Có lần bị sét đánh nhưng không chết, đó là lần đầu anh gặp em.",
    "Rất lâu rồi anh mới có cảm giác hồi hộp, ngại ngùng khi nói chuyện với một người con gái...",
    "...có mấy lần anh lấy hết can đảm để nắm tay em thì tim anh nó đập thình thịch zậy nè.",
    "Anh có cảm giác muốn che chở em. Anh cũng không còn trẻ để mà yêu trải nghiệm, anh sẽ đối xử tử tế với em, anh cũng sẽ không để em phải chịu tủi thân hay uất ức gì khi mà em quen anh.",
    "Anh đến hơi muộn, nhưng sẽ tử tế và yêu thương em.",
    "Anh hơi vụng về mấy chuyện như thế này, nhưng tất cả những gì anh ghi ở đây là thật lòng.",
  ];

  // Nội dung câu hỏi cuối cùng
  const question =
    "Anh thực sự không muốn bỏ lỡ em, hãy làm em bé của anh, em cho anh một cơ hội nhé Sơ Ri ❤️";

  // Cấu hình thời gian (miligiây)
  const messagePauseDuration = 1500; // Dừng sau khi gõ xong
  const fadeDuration = 500; // Thời gian mờ dần
  const postFadePause = 200; // Dừng sau khi mờ dần
  const typingSpeed = 60; // Tốc độ gõ

  // Biến trạng thái nhạc
  let isMusicPlaying = false;

  // Hàm cập nhật icon nút nhạc
  function updateMusicButtonIcon() {
    if (isMusicPlaying) {
      musicToggleButton.textContent = "🎵";
      musicToggleButton.setAttribute("aria-label", "Tắt nhạc");
    } else {
      musicToggleButton.textContent = "🔇";
      musicToggleButton.setAttribute("aria-label", "Bật nhạc");
    }
  }

  // Hàm gõ chữ, trả về Promise
  function typeWriter(element, text) {
    return new Promise((resolve) => {
      let charIndex = 0;
      element.textContent = "";
      element.style.opacity = 1;
      function type() {
        if (charIndex < text.length) {
          element.textContent += text.charAt(charIndex);
          charIndex++;
          setTimeout(type, typingSpeed);
        } else {
          resolve();
        }
      }
      setTimeout(type, 50);
    });
  }

  // Hàm hiển thị tuần tự các tin nhắn
  async function displayMessagesSequentially() {
    for (const messageText of messages) {
      messageElement.style.transition = "none";
      messageElement.style.opacity = 0;
      void messageElement.offsetWidth;
      messageElement.style.transition = `opacity ${
        fadeDuration / 1000
      }s ease-in-out`;
      await typeWriter(messageElement, messageText);
      await new Promise((resolve) => setTimeout(resolve, messagePauseDuration));
      messageElement.style.opacity = 0;
      await new Promise((resolve) =>
        setTimeout(resolve, fadeDuration + postFadePause)
      );
    }
    showQuestion();
  }

  // Hàm hiển thị khu vực câu hỏi
  function showQuestion() {
    messageElement.parentElement.style.display = "none";
    questionTextElement.textContent = question;
    questionBox.style.display = "block";
    setTimeout(() => {
      questionBox.classList.add("visible");
      positionNoButton();
    }, 100);
  }

  // Hàm đặt vị trí ban đầu cho nút "Không"
  function positionNoButton() {
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect(); // Dùng container để tính toán
    // Tính vị trí tương đối của nút Yes bên trong container
    const yesBtnOffsetTop = yesBtn.offsetTop;
    const yesBtnOffsetLeft = yesBtn.offsetLeft;

    // Đặt nút No gần bên phải nút Yes ban đầu
    const initialTop = yesBtnOffsetTop;
    const initialLeft = yesBtnOffsetLeft + yesBtn.offsetWidth + 20;

    noBtn.style.position = "absolute";
    // Giới hạn vị trí trong container
    noBtn.style.top = `${Math.max(
      15,
      Math.min(initialTop, container.offsetHeight - noBtn.offsetHeight - 15)
    )}px`;
    noBtn.style.left = `${Math.max(
      15,
      Math.min(initialLeft, container.offsetWidth - noBtn.offsetWidth - 15)
    )}px`;
  }

  // Hàm di chuyển nút "Không"
  function moveNoButton() {
    const containerRect = container.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();
    // Giới hạn di chuyển là kích thước của container (offsetWidth/Height) trừ đi kích thước nút và padding
    const maxX = container.offsetWidth - noBtn.offsetWidth - 20;
    const maxY = container.offsetHeight - noBtn.offsetHeight - 20;
    const minX = 10;
    const minY = 10;

    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;

    // Chống nút No đè lên nút Yes (sử dụng offsetTop/Left)
    const yesBtnOffsetTop = yesBtn.offsetTop;
    const yesBtnOffsetLeft = yesBtn.offsetLeft;
    const yesBtnOffsetBottom = yesBtnOffsetTop + yesBtn.offsetHeight;
    const yesBtnOffsetRight = yesBtnOffsetLeft + yesBtn.offsetWidth;
    const buffer = 15;
    const forbiddenZone = {
      top: yesBtnOffsetTop - buffer,
      left: yesBtnOffsetLeft - buffer,
      bottom: yesBtnOffsetBottom + buffer,
      right: yesBtnOffsetRight + buffer,
    };

    let attempts = 0;
    while (
      newX + noBtn.offsetWidth > forbiddenZone.left &&
      newX < forbiddenZone.right &&
      newY + noBtn.offsetHeight > forbiddenZone.top &&
      newY < forbiddenZone.bottom &&
      attempts < 100
    ) {
      newX = Math.random() * (maxX - minX) + minX;
      newY = Math.random() * (maxY - minY) + minY;
      attempts++;
    }

    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
  }

  // --- Event Listeners ---

  // 1. Bắt đầu khi nhấn vào màn hình chờ
  startScreen.addEventListener(
    "click",
    () => {
      startScreen.style.display = "none";
      mainContent.style.display = "block";
      // Phát nhạc và cập nhật nút
      backgroundMusic
        .play()
        .then(() => {
          console.log("Music started playing.");
          isMusicPlaying = true;
          updateMusicButtonIcon();
        })
        .catch((error) => {
          console.warn("Autoplay was prevented:", error);
          isMusicPlaying = false;
          updateMusicButtonIcon();
        });
      displayMessagesSequentially();
    },
    { once: true }
  );

  // 2. Khi rê chuột/click vào nút "Không"
  noBtn.addEventListener("mouseover", moveNoButton);
  noBtn.addEventListener("click", moveNoButton);

  // 3. Khi click vào nút "Có"
  yesBtn.addEventListener("click", () => {
    questionBox.style.display = "none";
    successMessage.style.display = "block";
  });

  // 4. Khi click vào nút bật/tắt nhạc
  musicToggleButton.addEventListener("click", () => {
    if (isMusicPlaying) {
      backgroundMusic.pause();
      isMusicPlaying = false;
    } else {
      backgroundMusic
        .play()
        .then(() => {
          isMusicPlaying = true;
          updateMusicButtonIcon();
        })
        .catch((error) => {
          console.error("Error playing music manually:", error);
          isMusicPlaying = false; // Giữ trạng thái tắt nếu lỗi
        });
    }
    updateMusicButtonIcon(); // Cập nhật icon ngay
  });
}); // Hết DOMContentLoaded
