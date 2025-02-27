import React, { useState, useEffect } from 'react';
import { HiChevronRight, HiChevronLeft } from "react-icons/hi2";
import AddIngredient from './assets/AddIngredient';
import './IngredientManager.css';
import IngredientTable from './assets/IngredientTable';
import axios from 'axios';
import Swal from 'sweetalert2';

const IngredientManager = () => {
    const [data, setData] = useState([]);   // Collecting datas from API
    const [showEditData, setShowEditData] = useState(false);    // show AddIngredient.jsx
    const [dataToEdit, setDataToEdit] = useState(null); // Edit data
    const [isEditing, setIsEditing] = useState(false);  // Add & Edit data (mode toggle)
    const [dataToDelete, setDataToDelete] = useState(null);     // Delete data

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 8;

    // API: Fetch data from database
    useEffect(() => {
        axios.get('http://localhost:5000/api/ingredients')
            .then(res => setData(res.data))
            .catch(err => console.error('Error fetching ingredients:', err));

        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => { setCategory(res.data); })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    // API: 1.Edit 2.Add
    const handleSaveData = (updatedData) => {
        if (isEditing) {
            //console.log('วัตถุดิบ  :', dataToEdit._id);
            axios.put(`http://localhost:5000/api/ingredients/${dataToEdit._id}`, updatedData)
                .then(res => {
                    //console.log('แก้ไขวัตถุดิบเป็น: ', res.data);
                    setData(data.map(user => (user._id === res.data._id ? res.data : user)));
                })
                .catch(err => console.error('Failed to update user:', err));
        } else {
            //console.log('วัตถุดิบ:', updatedData);
            axios.post('http://localhost:5000/api/ingredients', updatedData)
                .then(res => {
                    //console.log('เพิ่มวัตถุดิบเข้าสู่ database สำเร็จ');
                    setData(prev => [...prev, res.data]);
                })
                .catch(err => console.error('เพิ่มวัตถุดิบเข้าสู่ database ไม่สำเร็จ:', err));
        }
        setShowEditData(false); // ปิดหน้าต่าง AddIngredient.jsx
    };

    // API: 3.Delete
    const handleDeleteIngredient = (data) => {
        //console.log(data._id);
        axios.delete(`http://localhost:5000/api/ingredients/${data._id}`)
            .then((res) => {
                //console.log('วัตถุดิบที่ต้องการลบ:', res.data);
                Swal.fire({
                    title: 'วัตถุดิบถูกลบแล้ว!',
                    confirmButtonColor: '#64A2FF',
                    icon: 'success',
                });
                setData((prevData) => prevData.filter((item) => item._id !== data._id));
            })
            .catch((err) => {
                //console.error('เกิดข้อผิดพลาดในการลบวัตถุดิบ:', err);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาดในการลบวัตถุดิบ',
                    text: 'กรุณาลองใหม่อีกครั้ง',
                    icon: 'error',
                });
            });
    }


    // Edit function
    const handleEditData = (data) => {
        setDataToEdit(data);
        setIsEditing(true); // เปลี่ยนโหมดเป็น Edit
        setShowEditData(true);
    };

    // Add function
    const handleAddNewData = () => {
        setDataToEdit({ name: '', group: '', unit: '', remain: null, min: null });
        setIsEditing(false); // เปลี่ยนโหมดเป็น Add
        setShowEditData(true);
    };

    // Confirm delete function
    const handleClickConfirm = (e) => {
        setDataToDelete(e);
        Swal.fire({
            title: "แน่ใจใช่ไหม?",
            text: "คุณกำลังจะลบ" + "\nชื่อวัตถุดิบ: " + e.name + "\nหมวดหมู่: " + e.group,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff4b4b",
            cancelButtonColor: "#B2B2B2",
            confirmButtonText: 'ยืนยันการลบ',
            cancelButtonText: 'ยกเลิก',
            dangerMode: true,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteIngredient(e);
            } else {
                Swal.fire({
                    title: 'ยกเลิกการลบ',
                    confirmButtonColor: '#64A2FF',
                });
            }
        });
    };

    const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
    const handleCategoryFilter = (e) => setCategoryFilter(e.target.value);

    // Filter function
    const filteredIngredients = data.filter(ingredient =>
        ingredient.name.toLowerCase().includes(search) &&
        (categoryFilter ? ingredient.category === categoryFilter : true)
    );

    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIngredients = filteredIngredients.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handleBeforePage = () => currentPage > 1 && setCurrentPage(currentPage - 1);


    return (
        <>
            {/* Box ของ MenuList */}
            <Box
                sx={{
                    backgroundColor: "#fff",
                    width: isMobile ? "100%" : isTablet ? "65%" : "75%",
                    height: "100vh",
                    padding: "20px",
                    borderRadius: "8px",
                    overflowY: "auto",
                    marginRight: "10px",
                }}
            >
                <div class='inline-elements'>
                    <input
                        type="text"
                        placeholder="ค้นหาวัตถุดิบ"
                        className="search-bar"
                        onChange={handleSearch}
                        value={search}
                    />
                    <select className="category-filter" onChange={handleCategoryFilter} value={categoryFilter} style={{ marginTop: "10px" }}>
                        <option value="">หมวดหมู่</option>
                        <option value="เนื้อสัตว์">เนื้อสัตว์</option>
                        <option value="ผัก">ผัก</option>
                        <option value="ทะเล">ทะเล</option>
                        <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                        <option value="ของหวาน">ของหวาน</option>
                    </select>
                    <button className="blue-button" onClick={handleAddNewData}>
                        เพิ่มวัตถุดิบใหม่
                    </button>
                </div>
                <IngredientTable data={paginatedIngredients} onEdit={handleEditData} handleClickConfirm={handleClickConfirm} />
            </Box>

            {showEditData &&
                <AddIngredient
                    data={dataToEdit}
                    isEditing={isEditing}
                    onSave={handleSaveData}
                    onClose={() => setShowEditData(false)}
                />
            }
        </>
    );
};

export default IngredientManager;
