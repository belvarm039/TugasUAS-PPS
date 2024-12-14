import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [menuData, setMenuData] = useState([]); // Semua data menu
  const [selectedMenu, setSelectedMenu] = useState(null); // Menu yang dipilih untuk edit
  const [newStock, setNewStock] = useState(''); // Stock baru yang diinput
  const [isModalOpen, setIsModalOpen] = useState(false); // Kontrol modal

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Fungsi untuk mengambil semua data dari backend
  const fetchMenuData = async () => {
    try {
      const response = await fetch('http://localhost:3001/menus');
      const data = await response.json();
      setMenuData(data);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  // Fungsi untuk membuka modal dan memilih menu
  const handleEditClick = (menu) => {
    setSelectedMenu(menu);
    setNewStock(menu.stock); // Set nilai awal input stock
    setIsModalOpen(true);
  };

  // Fungsi untuk menyimpan perubahan stock
  const saveStock = async () => {
    try {
      await fetch(`http://localhost:3001/menus/${selectedMenu.menuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });
      alert('Stock updated successfully');
      fetchMenuData(); // Refresh data
      setIsModalOpen(false); // Tutup modal
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
    setNewStock('');
  };

  return (
    <div className="App">
      <h1>List Menu</h1>

      {/* Tabel untuk menampilkan semua data */}
      <table>
        <thead>
          <tr>
            <th>Menu ID</th>
            <th>Menu Name</th>
            <th>Stock</th>
            <th>Edit Stock</th>
          </tr>
        </thead>
        <tbody>
          {menuData.map((menu) => (
            <tr key={menu.menuid}>
              <td>{menu.menuid}</td>
              <td>{menu.menu_name}</td>
              <td>{menu.stock}</td>
              <td>
                <button onClick={() => handleEditClick(menu)}>Edit Stock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal untuk edit stock */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Stock for {selectedMenu.menu_name}</h2>
            <label>
              New Stock:
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button onClick={saveStock}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;