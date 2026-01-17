document.addEventListener('DOMContentLoaded', function () {

  const bookingForm = document.getElementById('bookingForm');
  const roomOptions = document.querySelectorAll('.room-option');
  const totalPriceInput = document.getElementById('totalPrice');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  /* ======================
     JUMLAH MALAM
  ====================== */
  function getNights() {
    if (!checkinInput.value || !checkoutInput.value) return 0;
    const inDate = new Date(checkinInput.value);
    const outDate = new Date(checkoutInput.value);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }

  /* ======================
     HITUNG TOTAL
  ====================== */
  function calculateTotal() {
    let totalPerNight = 0;

    roomOptions.forEach(room => {
      const qtyInput = document.getElementById(room.dataset.qty);

      if (room.checked) {
        const qty = parseInt(qtyInput.value || 1);
        totalPerNight += parseInt(room.dataset.price) * qty;
      }
    });

    const nights = getNights();
    const total = totalPerNight * nights;

    totalPriceInput.value = total > 0
      ? "Rp " + total.toLocaleString('id-ID')
      : "";
  }

  /* ======================
     AKTIFKAN JUMLAH
  ====================== */
  roomOptions.forEach(room => {
    const qtyInput = document.getElementById(room.dataset.qty);

    room.addEventListener('change', () => {
      qtyInput.disabled = !room.checked;
      calculateTotal();
    });

    qtyInput.addEventListener('input', calculateTotal);
  });

  checkinInput.addEventListener('change', calculateTotal);
  checkoutInput.addEventListener('change', calculateTotal);

  /* ======================
     SUBMIT
  ====================== */
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const payment = document.getElementById('paymentMethod').value;
    const nights = getNights();

    let roomDetails = [];
    let totalPerNight = 0;

    roomOptions.forEach(room => {
      if (room.checked) {
        const qty = document.getElementById(room.dataset.qty).value;
        roomDetails.push(`${room.value} x${qty}`);
        totalPerNight += room.dataset.price * qty;
      }
    });

    if (!name || roomDetails.length === 0 || nights === 0) {
      alert('Lengkapi data booking dengan benar.');
      return;
    }

    const total = totalPerNight * nights;

    const phone = "6282161323000";

    const message =
`BOOKING HOTEL RINDANG PANYABUNGAN

Nama Tamu   : ${name}
Check-in    : ${checkinInput.value}
Check-out   : ${checkoutInput.value}
Jumlah Malam: ${nights}
Kamar       : ${roomDetails.join(', ')}
Total Harga : Rp ${total.toLocaleString('id-ID')}
Pembayaran  : ${payment}

Mohon konfirmasi ketersediaan kamar.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    bookingForm.reset();
    totalPriceInput.value = "";
  });

});