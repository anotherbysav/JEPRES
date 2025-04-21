const form = document.getElementById('alumniForm');
const daftarPrestasi = document.getElementById('daftarPrestasi');
const judul = document.getElementById('judulDaftar');
let dataPrestasi = JSON.parse(localStorage.getItem('dataPrestasi')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nama = document.getElementById('nama').value;
  const angkatan = document.getElementById('angkatan').value;
  const prestasi = document.getElementById('prestasi').value;
  const deskripsi = document.getElementById('deskripsi').value;
  const tanggal = document.getElementById('tanggal').value;
  const sertifikatFile = document.getElementById('sertifikat').files[0];

  if (!sertifikatFile) {
    alert("Silakan upload bukti sertifikat.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const fileBase64 = event.target.result;

    const data = {
      nama,
      angkatan,
      prestasi,
      deskripsi,
      tanggal,
      sertifikatURL: fileBase64,
      sertifikatName: sertifikatFile.name
    };

    dataPrestasi.push(data);
    localStorage.setItem('dataPrestasi', JSON.stringify(dataPrestasi));
    renderPrestasi();
    form.reset();
    alert("Prestasi berhasil ditambahkan!");
  };

  reader.readAsDataURL(sertifikatFile);
});

function renderPrestasi() {
  daftarPrestasi.innerHTML = '';

  if (dataPrestasi.length === 0) {
    judul.style.display = 'none';
    daftarPrestasi.innerHTML = "<p>Belum ada data prestasi.</p>";
    return;
  }

  judul.style.display = 'block';

  dataPrestasi.forEach((item, index) => {
    const isImage = item.sertifikatURL.startsWith('data:image') || item.sertifikatURL.match(/\.(jpeg|jpg|png|gif)$/i);
    daftarPrestasi.innerHTML += `
      <div class="card">
        <strong>${item.nama}</strong> (Angkatan ${item.angkatan})<br/>
        <em>${item.prestasi}</em> - ${new Date(item.tanggal).toLocaleDateString()}<br/>
        <p>${item.deskripsi}</p>
        <div class="sertifikat">
          ${isImage
            ? `<img src="${item.sertifikatURL}" alt="Sertifikat" class="sertifikat-img" />`
            : `<a href="${item.sertifikatURL}" target="_blank">📄 Lihat Sertifikat (${item.sertifikatName})</a>`}
        </div>
        <button class="hapus-btn" onclick="hapusPrestasi(${index})">🗑 Hapus</button>
      </div>
    `;
  });
}

function hapusPrestasi(index) {
  if (confirm("Yakin ingin menghapus prestasi ini?")) {
    dataPrestasi.splice(index, 1);
    localStorage.setItem('dataPrestasi', JSON.stringify(dataPrestasi));
    renderPrestasi();
  }
}
