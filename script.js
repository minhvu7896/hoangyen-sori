document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử HTML cần thiết
  const startScreen = document.getElementById("start-screen");
  const mainContent = document.getElementById("main-content");
  const backgroundMusic = document.getElementById("background-music");
  const messageElement = document.getElementById("current-message"); // Thẻ p duy nhất để hiển thị tin nhắn
  const questionBox = document.getElementById("question-box");
  const questionTextElement = document.querySelector(".question");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const successMessage = document.getElementById("success-message");
  const container = document.querySelector(".container"); // Container chính

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
  const messagePauseDuration = 1500; // Thời gian dừng lại sau khi gõ xong 1 câu
  const fadeDuration = 500; // Thời gian hiệu ứng mờ dần (phải khớp transition CSS)
  const postFadePause = 200; // Thời gian chờ sau khi mờ dần trước khi hiện câu mới
  const typingSpeed = 60; // Tốc độ gõ chữ (càng nhỏ càng nhanh)

  // Hàm gõ chữ hiệu ứng typing, trả về Promise
  function typeWriter(element, text) {
    return new Promise((resolve) => {
      let charIndex = 0;
      element.textContent = ""; // Xóa nội dung cũ trước khi gõ
      element.style.opacity = 1; // Hiện thẻ p lên (với transition)

      function type() {
        if (charIndex < text.length) {
          element.textContent += text.charAt(charIndex);
          charIndex++;
          setTimeout(type, typingSpeed);
        } else {
          resolve(); // Đã gõ xong, giải quyết Promise
        }
      }
      // Bắt đầu gõ sau một khoảng trễ nhỏ để đảm bảo opacity=1 được áp dụng
      setTimeout(type, 50);
    });
  }

  // Hàm chính: hiển thị tuần tự các tin nhắn
  async function displayMessagesSequentially() {
    // Lặp qua từng tin nhắn trong mảng
    for (const messageText of messages) {
      // Đảm bảo thẻ p đang ẩn (opacity=0) trước khi bắt đầu gõ
      messageElement.style.transition = "none"; // Tạm tắt transition để set opacity ngay lập tức
      messageElement.style.opacity = 0;
      // Ép trình duyệt render lại để nhận opacity=0
      // Dùng offsetWidth để buộc trình duyệt tính toán lại layout
      void messageElement.offsetWidth;
      messageElement.style.transition = `opacity ${
        fadeDuration / 1000
      }s ease-in-out`; // Bật lại transition

      // Gõ chữ vào thẻ p và đợi (await) cho đến khi gõ xong
      await typeWriter(messageElement, messageText);

      // Chờ một khoảng thời gian sau khi đã gõ xong
      await new Promise((resolve) => setTimeout(resolve, messagePauseDuration));

      // Làm mờ dần tin nhắn hiện tại bằng cách set opacity = 0
      messageElement.style.opacity = 0;

      // Chờ cho hiệu ứng mờ dần hoàn thành + một khoảng dừng ngắn trước khi qua câu mới
      await new Promise((resolve) =>
        setTimeout(resolve, fadeDuration + postFadePause)
      );
    }

    // Sau khi tất cả tin nhắn đã hiển thị và ẩn đi -> hiển thị câu hỏi
    showQuestion();
  }

  // Hàm hiển thị khu vực câu hỏi
  function showQuestion() {
    // Ẩn khu vực message đi (không cần thiết nữa)
    messageElement.parentElement.style.display = "none";

    questionTextElement.textContent = question; // Đặt nội dung câu hỏi
    questionBox.style.display = "block"; // Hiện box câu hỏi
    // Thêm class visible để kích hoạt hiệu ứng fade-in cho box câu hỏi (nếu có trong CSS)
    setTimeout(() => {
      questionBox.classList.add("visible");
      positionNoButton(); // Đặt vị trí ban đầu cho nút "Không"
    }, 100); // Delay nhỏ để transition CSS kịp nhận class
  }

  // Hàm đặt vị trí ban đầu cho nút "Không"
  function positionNoButton() {
    // Lấy vị trí và kích thước của nút "Có" và container
    const yesBtnRect = yesBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Tính toán vị trí tương đối so với container
    // Đặt bên phải nút "Có" làm vị trí khởi đầu
    const initialTop = yesBtn.offsetTop; // Cùng hàng với nút có
    const initialLeft = yesBtn.offsetLeft + yesBtn.offsetWidth + 20; // Cách nút có 20px về bên phải

    noBtn.style.position = "absolute"; // Đảm bảo là absolute
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

  // Hàm di chuyển nút "Không" đến vị trí ngẫu nhiên
  function moveNoButton() {
    const containerRect = container.getBoundingClientRect(); // Kích thước container
    const noBtnRect = noBtn.getBoundingClientRect(); // Kích thước nút No
    const yesBtnRect = yesBtn.getBoundingClientRect(); // Kích thước nút Yes

    // Tính toán giới hạn di chuyển bên trong container (trừ đi kích thước nút và padding)
    const maxX = container.offsetWidth - noBtnRect.width - 20; // 20 là padding/khoảng cách an toàn
    const maxY = container.offsetHeight - noBtnRect.height - 20;
    const minX = 10;
    const minY = 10;

    // Tạo vị trí ngẫu nhiên mới
    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;

    // --- Chống nút No đè lên nút Yes ---
    // Chuyển đổi tọa độ nút Yes sang hệ tọa độ của container
    const yesBtnContainerTop = yesBtn.offsetTop;
    const yesBtnContainerLeft = yesBtn.offsetLeft;
    const yesBtnContainerBottom = yesBtnContainerTop + yesBtn.offsetHeight;
    const yesBtnContainerRight = yesBtnContainerLeft + yesBtn.offsetWidth;

    // Xác định vùng cấm xung quanh nút Yes (mở rộng ra một chút)
    const buffer = 15; // Khoảng cách an toàn xung quanh nút Yes
    const forbiddenZone = {
      top: yesBtnContainerTop - buffer,
      left: yesBtnContainerLeft - buffer,
      bottom: yesBtnContainerBottom + buffer,
      right: yesBtnContainerRight + buffer,
    };

    // Kiểm tra nếu vị trí mới (toàn bộ nút No) rơi vào vùng cấm, thử lại
    let attempts = 0;
    while (
      newX + noBtnRect.width > forbiddenZone.left &&
      newX < forbiddenZone.right &&
      newY + noBtnRect.height > forbiddenZone.top &&
      newY < forbiddenZone.bottom &&
      attempts < 100 // Giới hạn số lần thử để tránh vòng lặp vô hạn
    ) {
      newX = Math.random() * (maxX - minX) + minX;
      newY = Math.random() * (maxY - minY) + minY;
      attempts++;
    }
    // console.log("Attempts to avoid Yes:", attempts); // Để debug

    // Áp dụng vị trí mới cho nút No
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
  }

  // --- Event Listeners ---

  // 1. Bắt đầu khi nhấn vào màn hình chờ
  startScreen.addEventListener(
    "click",
    () => {
      startScreen.style.display = "none"; // Ẩn màn hình chờ
      mainContent.style.display = "block"; // Hiện nội dung chính

      // Cố gắng phát nhạc nền (có thể bị chặn bởi trình duyệt)
      backgroundMusic.play().catch((error) => {
        console.warn(
          "Phát nhạc tự động bị chặn, cần tương tác người dùng:",
          error
        );
        // Có thể thêm một nút "Bật nhạc" nếu muốn chắc chắn
      });

      // Bắt đầu chuỗi hiển thị tin nhắn
      displayMessagesSequentially();
    },
    { once: true }
  ); // Chỉ chạy 1 lần click đầu tiên

  // 2. Khi rê chuột vào nút "Không" -> di chuyển nó
  noBtn.addEventListener("mouseover", moveNoButton);
  // 3. Khi click vào nút "Không" (phòng trường hợp click nhanh) -> cũng di chuyển nó
  noBtn.addEventListener("click", moveNoButton);

  // 4. Khi click vào nút "Có"
  yesBtn.addEventListener("click", () => {
    // Ẩn khu vực câu hỏi
    questionBox.style.display = "none";
    // Hiện thông báo thành công
    successMessage.style.display = "block";

    // Tùy chọn: Dừng nhạc nền hoặc phát âm thanh khác
    // backgroundMusic.pause();
    // const celebrationSound = new Audio('sound/success.mp3'); // Ví dụ
    // celebrationSound.play();
  });
}); // Hết DOMContentLoaded
