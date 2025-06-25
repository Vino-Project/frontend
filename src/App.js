import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [pesan, setPesan] = useState("");
  const [log, setLog] = useState([]);
  const [ukuran, setUkuran] = useState("");
  const [email, setEmail] = useState("");
  const [gambar, setGambar] = useState(null);
  const [hasil, setHasil] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const prediksiRef = useRef(null);
  const spamRef = useRef(null);
  const gambarRef = useRef(null);
  const topRef = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const kirimPesan = async () => {
    if (!pesan.trim()) return;
    const pesanUser = { role: "User", teks: pesan };
    setLog((prev) => [...prev, pesanUser]);

    try {
      //const response = await axios.post("http://localhost:5000/chat", { pesan });
      const response = await axios.post("https://backend-production-17a5.up.railway.app/chat", { pesan })
      const botReply = response.data.balasan;
      const pesanBot = { role: "AI", teks: botReply };
      setLog((prev) => [...prev, pesanBot]);
      setPesan("");

      if (botReply.includes("Prediksi Harga Rumah")) {
        prediksiRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (botReply.includes("Deteksi Spam")) {
        spamRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (botReply.includes("Analisa Gambar")) {
        gambarRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      setLog((prev) => [...prev, { role: "AI", teks: "Terjadi kesalahan." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") kirimPesan();
  };

  const prediksiHarga = async () => {
    if (!ukuran.trim()) return setHasil("Ukuran tidak boleh kosong!");
    try {
      //const res = await axios.post("http://localhost:5000/prediksi-harga", { ukuran });
      const res = await axios.post("https://backend-production-17a5.up.railway.app/prediksi-harga", { ukuran });
      setHasil(res.data.hasil);
    } catch {
      setHasil("Gagal memprediksi harga.");
    }
  };

  const cekSpam = async () => {
    if (!email.trim()) return setHasil("Isi email tidak boleh kosong!");
    try {
      //const res = await axios.post("http://localhost:5000/cek-spam", { email });
      const res = await axios.post("https://backend-production-17a5.up.railway.app/cek-spam", { email });
      setHasil(res.data.hasil);
    } catch {
      setHasil("Gagal mendeteksi spam.");
    }
  };

  const analisaGambar = async () => {
    if (!gambar) return setHasil("Pilih gambar terlebih dahulu.");
    const formData = new FormData();
    formData.append("gambar", gambar);
    try {
      //const res = await axios.post("http://localhost:5000/analisa-gambar", formData, {
      const res = await axios.post("https://backend-production-17a5.up.railway.app/analisa-gambar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setHasil(res.data.hasil);
    } catch {
      setHasil("Gagal menganalisis gambar.");
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`} ref={topRef}>
      <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
      <h1>🤖 AI Chatbot + Multi-Tools</h1>

      <div className="chat-container">
        <h2>Chatbot Interaktif</h2>
        <div className="chat-box">
          {log.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role.toLowerCase()}`}>
              <span className="avatar">{msg.role === "User" ? "👤" : "🤖"}</span>
              <div className="chat-bubble">{msg.teks}</div>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan untuk AI..."
          />
          <button onClick={kirimPesan}>Kirim</button>
        </div>
      </div>

      <div className="tools-container">
        <h2>🎯 AI Tools</h2>

        <div className="form-group" ref={prediksiRef}>
          <h4>🏠 Prediksi Harga Rumah</h4>
          <input
            type="number"
            placeholder="Ukuran rumah (m²)"
            value={ukuran}
            onChange={(e) => setUkuran(e.target.value)}
          />
          <button onClick={prediksiHarga}>Prediksi</button>
        </div>

        <div className="form-group" ref={spamRef}>
          <h4>📧 Deteksi Spam Email</h4>
          <textarea
            placeholder="Masukkan teks email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={cekSpam}>Cek Spam</button>
        </div>

        <div className="form-group" ref={gambarRef}>
          <h4>🖼️ Analisa Gambar</h4>
          <input type="file" accept="image/*" onChange={(e) => setGambar(e.target.files[0])} />
          <button onClick={analisaGambar}>Analisa</button>
        </div>

        <div className="hasil">
          <h4>Hasil:</h4>
          <p>{hasil}</p>
        </div>
      </div>

      <button className="scroll-up-btn" onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })}>
        ⬆️
      </button>
    </div>
  );
}

export default App;
