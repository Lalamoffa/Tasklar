

const profilePic = document.getElementById('profilePic');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const fileBtn = document.getElementById('file-btn');
const filePicker = document.getElementById('file-picker');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatMessage = document.getElementById('chat-message');
const documentBtn = document.getElementById('document-btn');
const imageBtn = document.getElementById('image-btn');
const fileInput = document.getElementById('file-input');
const fileInputProfile = document.getElementById('fileInputProfile');

const recordButton = document.getElementById('recordButton');
let mediaRecorder;
let audioChunks = [];

recordButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            if (!mediaRecorder || mediaRecorder.state === 'inactive') {
                // Ses kaydını başlat
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                recordButton.classList.add('recording'); // Görsel olarak butonu değiştirir (örneğin kırmızıya dönebilir)
                
                // Ses verilerini toplar
                mediaRecorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });

                // Kaydetme işlemi durdurulduğunda:
                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    audio.controls = true; // Ses kontrolleri

                    // Yeni mesaj divi oluştur
                    const newMessage = document.createElement('div');
                    newMessage.classList.add('voice-message');
                    newMessage.appendChild(audio);

                    // Mesajı chat ekranına ekle
                    const chatMessage = document.getElementById('chat-message');
                    chatMessage.appendChild(newMessage);

                    // Sonraki kayıt için temizle
                    audioChunks = [];
                    recordButton.classList.remove('recording');
                });

                // 5 saniye sonra kaydı otomatik durdur (ihtiyaca göre ayarlanabilir)
                setTimeout(() => {
                    mediaRecorder.stop();
                }, 5000);
            } else if (mediaRecorder.state === 'recording') {
                // Kaydı durdur
                mediaRecorder.stop();
                recordButton.classList.remove('recording');
            }
        })
        .catch(error => {
            console.error('Mikrofon izni alınamadı:', error);
        });
});


profilePic.addEventListener('click', () => {
    fileInputProfile.click()
});

// Fayl seçildikdə profil şəklinin yenilənməsi
fileInputProfile.addEventListener('change', (event) => {
    const file = event.target.files[0];

    // Yalnız şəkil fayllarını qəbul etmək üçün yoxlama
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePic.src = e.target.result; // Profil şəklini dəyişir
        }
        reader.readAsDataURL(file);
    } else {
        // SweetAlert ilə xəbərdarlıq mesajı
        Swal.fire({
            icon: 'error',
            title: 'Yanlış fayl tipi!',
            text: 'Yalnız şəkil faylları seçin!',
            confirmButtonText: 'Bağla'
        });
    }
});

// Emoji seçimi üçün funksionallıq
emojiBtn.addEventListener('click', () => {
    toggleVisibility(emojiPicker);
});

// Emoji seçərək inputa əlavə etmək
emojiPicker.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        messageInput.value += e.target.textContent;
        // emojiPicker.style.display = 'none'; // Bu satırı kaldırın veya yorum yapın
    }
});

// Mesaj göndərmə funksionallığı
sendBtn.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const newMessage = document.createElement('div');
        newMessage.classList.add('text');
        newMessage.textContent = messageText;
        newMessage.style.backgroundColor = '#0f96da'; // Mətn daxil edildikdə arxa fon
        newMessage.style.color = '#fff'; // Mətn rəngi
        newMessage.style.padding = '5px'; // Yastıq qoyma
        chatMessage.appendChild(newMessage);
        messageInput.value = ''; // Inputu təmizlə
        messageInput.focus(); // Inputa fokuslan

        // Emoji penceresini kapat
        emojiPicker.style.display = 'none'; // Mesaj gönderildiğinde emoji penceresini kapat

        // Scroll'u en alta kaydır
        chatMessage.scrollTop = chatMessage.scrollHeight;
    }
});


// Fayl seçmə bölməsinin görünürlüğünü dəyişdirən funksiya
function toggleVisibility(element) {
    if (element.style.display === 'block') {
        element.style.display = 'none'; // Bağlanır
    } else {
        element.style.display = 'block'; // Açılır
    }
}

// Fayl seçmə bölməsinin göstərilməsi
fileBtn.addEventListener('click', (event) => {
    // İkonun koordinatlarını əldə edirik
    const iconRect = fileBtn.getBoundingClientRect();

    // Fayl seçmə pəncərəsini koordinatlar üzrə yerləşdiririk
    filePicker.style.left = `auto`;
    filePicker.style.right = `0px`;

    // Görünürlüğünü dəyişdiririk
    toggleVisibility(filePicker);
});


// Fayl növü seçildikdə fayl seçim pəncərəsi açılır
documentBtn.addEventListener('click', () => {
    fileInput.accept = ".pdf,.doc,.docx,.txt"; // Sənəd növləri
    fileInput.click(); // Fayl pəncərəsini aç
});

imageBtn.addEventListener('click', () => {
    fileInput.accept = "image/*"; // Yalnız şəkillər
    fileInput.click(); // Fayl pəncərəsini aç
});

// Fayl seçildikdə faylı mesaj bölməsinə əlavə et
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileType = file.type;
        const fileName = file.name;

        const newMessage = document.createElement('div');
        newMessage.classList.add('file-message');

        // Şəkil və ya sənəd olduğunu yoxla
        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file); // Şəkili göstər
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.borderRadius = '10px';
            newMessage.appendChild(img);
        } else {
            newMessage.textContent = `Sənəd: ${fileName}`;
        }

        chatMessage.appendChild(newMessage);
        chatMessage.scrollTop = chatMessage.scrollHeight;
    }
});

// Mesaj göndərmə funksionallığı,
sendBtn.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const newMessage = document.createElement('div');
        newMessage.classList.add('text');
        newMessage.textContent = messageText;
        newMessage.style.backgroundColor = '#0f96da'; // Mətn daxil edildikdə arxa fon
        newMessage.style.color = '#fff'; // Mətn rəngi
        newMessage.style.padding = '5px'; // Yastıq qoyma
        chatMessage.appendChild(newMessage);
        messageInput.value = ''; // Inputu təmizlə
        messageInput.focus(); // Inputa fokuslan
        chatMessage.scrollTop = chatMessage.scrollHeight;

    }
});

// Göstərmə/gizlətmə funksiyası
function toggleVisibility(element) {
    if (element.style.display === 'none' || element.style.display === '') {
        closeAll();
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

// Bütün popup pəncərələri bağlamaq
function closeAll() {
    emojiPicker.style.display = 'none';
    filePicker.style.display = 'none';
}

// Səhifə xaricinə klik edildikdə pəncərələri bağlamaq
document.addEventListener('click', (e) => {
    if (!emojiBtn.contains(e.target) && !emojiPicker.contains(e.target) &&
        !fileBtn.contains(e.target) && !filePicker.contains(e.target)) {
        closeAll();
    }
});