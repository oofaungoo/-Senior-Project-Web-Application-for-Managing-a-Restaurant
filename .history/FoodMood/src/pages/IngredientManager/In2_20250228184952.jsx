import React, { useState, useEffect } from 'react';
import { Grid, Box, Modal, useMediaQuery } from "@mui/material";
import AddIngredient from './assets/AddIngredient';
import './IngredientManager.css';
import IngredientTable from './assets/IngredientTable';
import axios from 'axios';
import Swal from 'sweetalert2';

const IngredientManager = () => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1040px)");

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

        axios.get('http://localhost:5000/api/ingredient_categories')
            .then(res => setData(res.data))
            .catch(err => console.error('Error fetching ingredients:', err));

        axios.get('http://localhost:5000/api/add_menus/category')
            .then(res => { setCategory(res.data); })
            .catch(err => console.error('Error fetching categories:', err));
    }, []);

    // API: 1.Edit 2.Add
    const handleSaveData = (updatedData) => {
        if (isEditing) {
            console.log('วัตถุดิบ (อัปเดต):', dataToEdit._id);
            axios.put(`http://localhost:5000/api/ingredients/${dataToEdit._id}`, updatedData)
                .then(res => {setData(data.map(user => (user._id === res.data._id ? res.data : user)));})
                .catch(err => console.error('Failed to update user:', err));
        } else {
            console.log('วัตถุดิบ (ใหม่):', updatedData);
            axios.post('http://localhost:5000/api/ingredients', updatedData)
                .then(res => {setData(prev => [...prev, res.data]);})
                .catch(err => console.error('เพิ่มวัตถุดิบเข้าสู่ database ไม่สำเร็จ:', err));
        }
        setShowEditData(false);
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
    const handleCategoryFilter = (e) => { setCategoryFilter(e.target.value); };


    // Filter function
    const filteredIngredients = data.filter(ingredient =>
        ingredient.name.toLowerCase().includes(search) &&
        (categoryFilter ? ingredient.category === categoryFilter : true)
    );

    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIngredients = filteredIngredients.slice(startIndex, startIndex + itemsPerPage);
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
                <Grid container spacing={1} marginBottom="8px" alignItems="center">
                    <Grid item xs={8} lg={4}>
                        <input type="text" placeholder="ค้นหาวัตถุดิบ" value={search} onChange={handleSearch} />
                    </Grid>

                    <Grid item xs={4} lg={4}>
                        <select onChange={handleCategoryFilter} value={categoryFilter} style={{ width: "120px" }}>
                            <option value="">ทั้งหมด</option>
                            <option value="เนื้อสัตว์">เนื้อสัตว์</option>
                            <option value="ผัก">ผัก</option>
                            <option value="ทะเล">ทะเล</option>
                            <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                            <option value="ผลไม้">ผลไม้</option>
                        </select>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <button className="blue-button" onClick={handleAddNewData} style={{ width: "100%" }}>
                            เพิ่มวัตถุดิบใหม่
                        </button>
                    </Grid>
                </Grid>

                {/* 
                <div class='inline-elements'>
                    <select className="category-filter" onChange={handleCategoryFilter} value={categoryFilter} style={{ marginTop: "10px" }}>
                        <option value="">ทั้งหมด</option>
                        <option value="เนื้อสัตว์">เนื้อสัตว์</option>
                        <option value="ผัก">ผัก</option>
                        <option value="ทะเล">ทะเล</option>
                        <option value="เครื่องดื่ม">เครื่องดื่ม</option>
                        <option value="ผลไม้">ผลไม้</option>
                    </select>
                    <button className="blue-button" onClick={handleAddNewData}>
                        เพิ่มวัตถุดิบใหม่
                    </button>
                </div>*/}

                <IngredientTable data={paginatedIngredients} onEdit={handleEditData} handleClickConfirm={handleClickConfirm} />
            </Box>

            {/* Desktop & Tablet: แสดง AddMenu และ MenuItemDetail ด้านขวา */}
            {!isMobile && (showEditData) && (
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        width: isTablet ? "35%" : "25%", // Box ของ Tablet = 30%, Desktop = 25%
                        height: "100vh",
                        padding: "20px",
                        borderRadius: "8px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {showEditData &&
                        <AddIngredient
                            data={dataToEdit}
                            isEditing={isEditing}
                            onSave={handleSaveData}
                            onClose={() => setShowEditData(false)}
                        />
                    }
                </Box>
            )}

            {/* Mobile - ใช้ Modal */}
            {isMobile && (
                <Modal
                    open={showEditData}
                    onClose={() => {
                        setShowEditData(false);
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "15px",
                            borderRadius: "8px",
                            maxWidth: "90vw",
                            height: "80vh",
                            margin: "10vh auto",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {showEditData &&
                            <AddIngredient
                                data={dataToEdit}
                                isEditing={isEditing}
                                onSave={handleSaveData}
                                onClose={() => setShowEditData(false)}
                            />
                        }
                    </Box>
                </Modal>
            )}


        </>
    );
};

export default IngredientManager;
