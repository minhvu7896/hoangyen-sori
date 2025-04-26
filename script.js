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
  const musicToggleButton = document.getElementById("music-toggle-btn");

  // Danh sách các lời nhắn (giữ nguyên)
  const messages = [
    "Sơ Ri ơi...",
    "Có lần bị sét đánh nhưng không chếch, đó là lần đầu anh gặp em.",
    "Rất lâu rồi anh mới có cảm giác hồi hộp, ngại ngùng khi nói chuyện với một người con gái...",
    "...có mấy lần anh lấy hết can đảm để nắm tay em thì tim anh nó đập thình thịch zậy nè.",
    "Anh có cảm giác muốn che chở em. Anh cũng không còn trẻ để mà yêu trải nghiệm, anh sẽ đối xử tử tế với em, anh cũng sẽ không để em phải chịu tủi thân hay uất ức gì khi mà em quen anh.",
    "Anh đến hơi muộn, nhưng sẽ tử tế và yêu thương em.",
    "Anh hơi vụng về mấy chuyện như thế này, nhưng tất cả những gì anh ghi ở đây là thật lòng.",
    "Mỗi ngày được nhìn thấy nụ cười của em là một ngày hạnh phúc với anh.",
    "Lần mà anh vui nhất là bữa mà anh mua mattcha cho em, em mặc sơ mi trắng quần tây í, xong còn nhảy chân sáo, cute quá àaa.",
    // "Em có biết, đôi mắt em đẹp đến nỗi khiến anh quên mất rằng còn cả thế giới xung quanh."
  ];

  // Nội dung câu hỏi cuối cùng (giữ nguyên)
  const question =
    "Anh thực sự không muốn bỏ lỡ em, hãy làm em bé của anh nha, em cho anh một cơ hội nhé Sơ Ri ❤️";

  // Cấu hình thời gian (giữ nguyên)
  const messagePauseDuration = 1500;
  const fadeDuration = 500;
  const postFadePause = 200;
  const typingSpeed = 60;

  // Biến trạng thái nhạc (giữ nguyên)
  let isMusicPlaying = false;

  // --- THÊM HÀM TẠO HIỆU ỨNG TIM BAY ---
  function createHearts() {
    setInterval(() => {
      const heart = document.createElement("div");
      heart.classList.add("heart"); // Sử dụng class 'heart' đã định nghĩa trong CSS
      heart.innerHTML = "❤️"; // Nội dung là trái tim
      // Vị trí xuất hiện ngẫu nhiên ở dưới cùng màn hình
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.bottom = "-30px"; // Xuất phát từ dưới cạnh màn hình một chút
      // Kích thước ngẫu nhiên
      heart.style.fontSize = Math.random() * 15 + 10 + "px"; // Random từ 10px đến 25px
      // Thời gian animation ngẫu nhiên
      const animationDuration = Math.random() * 5 + 4; // Random từ 4s đến 9s
      heart.style.animation = `floatUp ${animationDuration}s linear forwards`;

      document.body.appendChild(heart); // Thêm tim vào body

      // Xóa trái tim khỏi DOM sau khi animation kết thúc + thêm chút thời gian
      setTimeout(() => {
        heart.remove();
      }, animationDuration * 1000 + 500);
    }, 400); // Tạo tim mới mỗi 400ms (có thể điều chỉnh)
  }
  // --- KẾT THÚC HÀM TẠO TIM ---

  // Hàm cập nhật icon nút nhạc (giữ nguyên)
  function updateMusicButtonIcon() {
    if (isMusicPlaying) {
      musicToggleButton.textContent = "🎵";
      musicToggleButton.setAttribute("aria-label", "Tắt nhạc");
    } else {
      musicToggleButton.textContent = "🔇";
      musicToggleButton.setAttribute("aria-label", "Bật nhạc");
    }
  }

  // Hàm gõ chữ, trả về Promise (giữ nguyên)
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

  // Hàm hiển thị tuần tự các tin nhắn (giữ nguyên)
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

  // Hàm hiển thị khu vực câu hỏi (giữ nguyên)
  function showQuestion() {
    messageElement.parentElement.style.display = "none";
    questionTextElement.textContent = question;
    questionBox.style.display = "block";
    setTimeout(() => {
      questionBox.classList.add("visible");
      positionNoButton();
    }, 100);
  }

  // Hàm đặt vị trí ban đầu cho nút "Không" (giữ nguyên)
  function positionNoButton() {
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const yesBtnOffsetTop = yesBtn.offsetTop;
    const yesBtnOffsetLeft = yesBtn.offsetLeft;
    const initialTop = yesBtnOffsetTop;
    const initialLeft = yesBtnOffsetLeft + yesBtn.offsetWidth + 20;
    noBtn.style.position = "absolute";
    noBtn.style.top = `${Math.max(
      15,
      Math.min(initialTop, container.offsetHeight - noBtn.offsetHeight - 15)
    )}px`;
    noBtn.style.left = `${Math.max(
      15,
      Math.min(initialLeft, container.offsetWidth - noBtn.offsetWidth - 15)
    )}px`;
  }

  // Hàm di chuyển nút "Không" (giữ nguyên)
  function moveNoButton() {
    const containerRect = container.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();
    const maxX = container.offsetWidth - noBtn.offsetWidth - 20;
    const maxY = container.offsetHeight - noBtn.offsetHeight - 20;
    const minX = 10;
    const minY = 10;
    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;
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

      // --- GỌI HÀM TẠO TIM ---
      createHearts();
      // --- KẾT THÚC GỌI HÀM TẠO TIM ---

      displayMessagesSequentially(); // Bắt đầu hiển thị tin nhắn
    },
    { once: true }
  ); // Chỉ chạy 1 lần

  // 2. Khi rê chuột/click vào nút "Không" (giữ nguyên)
  noBtn.addEventListener("mouseover", moveNoButton);
  noBtn.addEventListener("click", moveNoButton);

  // Xử lý cho màn hình cảm ứng (touch)
  noBtn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault(); // Ngăn sự kiện click/scroll mặc định
      moveNoButton(); // Gọi hàm di chuyển khi chạm vào
    },
    { passive: false }
  );

  // 3. Khi click vào nút "Có" (giữ nguyên)
  yesBtn.addEventListener("click", () => {
    questionBox.style.display = "none";
    successMessage.style.display = "block";
    // Có thể tăng cường hiệu ứng tim khi nhấn Yes
    // Ví dụ: tạo thêm nhiều tim hơn ngay lập tức
    for (let i = 0; i < 30; i++) {
      setTimeout(createSingleHeart, i * 50); // Tạo tim liên tục trong 1.5s
    }
  });

  // Hàm tạo 1 trái tim (dùng cho hiệu ứng khi nhấn Yes)
  function createSingleHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.bottom = "-30px";
    heart.style.fontSize = Math.random() * 15 + 10 + "px";
    const animationDuration = Math.random() * 4 + 3; // Bay nhanh hơn chút
    heart.style.animation = `floatUp ${animationDuration}s linear forwards`;
    document.body.appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, animationDuration * 1000 + 500);
  }

  // 4. Khi click vào nút bật/tắt nhạc (giữ nguyên)
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
          isMusicPlaying = false;
        });
    }
    updateMusicButtonIcon();
  });
}); // Hết DOMContentLoaded
