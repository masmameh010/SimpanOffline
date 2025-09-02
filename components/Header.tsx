import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="mb-8 text-center">
            <div className="header-gradient text-white py-6 px-4 rounded-2xl shadow-lg mb-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                    PENYIMPAN KOLEKSI GAMBAR AI
                </h1>
                <p className="text-white text-lg">by IMAJINASILOKAL</p>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
                Simpan dan kelola koleksi gambar AI beserta prompt dan parameternya dengan mudah.
                Khusus untuk pengguna Tensor, Midjourney, Gemini, dan platform AI lainnya.
            </p>
        </header>
    );
};

export default Header;