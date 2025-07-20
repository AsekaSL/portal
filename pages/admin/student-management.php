<?php
include("/xampp/htdocs/portal/config/dbConnection.php");
?>
<div class="managment-container">
    <div class="right-section">
        <form id="userForm" method="post" class="all-form-controller">

            <div class="first-form-container">
                <div class="input-container">
                    <label for="full_name">Full Name</label>
                    <input type="text" name="full_name" id="full_name">
                </div>
                <div class="input-container">
                    <label for="year">Year</label>
                    <select name="year" id="year">
                        <option>Select</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
                <div class="input-container">
                    <label for="department">Department</label>
                    <select name="dep_id" id="department">
                        <option>Select</option>
                    </select>
                </div>
                <div class="input-container">
                    <label for="regi_Num">Registration Number</label>
                    <input type="text" name="regi_num" id="regi_num">
                </div>
                <div class="input-container">
                    <label for="contactNumber">Contact Number</label>
                    <input type="text" name="contact_num" id="contact_num">
                </div>
                <div class="input-container">
                    <label for="address">Address</label>
                    <input type="text" name="address" id="address">
                </div>

            </div>
            <div class="second-form-container">
                <div>
                    <label for="email">Email address</label>
                    <input type="email" name="email" id="email">
                </div>
                <div>
                    <label for="indexNum">Index Number</label>
                    <input type="text" name="index_num" id="index_num" required>
                </div>
                <button class="submit-button">Submit</button>
                <button type="button" onclick="serachStudent();">Search</button>
                <button type="button" onclick="upadateStudent();">Update</button>
                <button type="button" onclick="deleteStudent();">Delete</button>
            </div>

        </form>
        <div class="serach-container">
            <div class="serach-box">
                <input type="text" name="search" class="serach-bar" placeholder="Enter Student Name">
                <img src="../../assets/admin/student-managment/search.png" class="search-img">
            </div>
        </div>
        <div class="table-container">
            <table border="1" id="student-table">
                <tr>
                    <td colspan="5">There no any data</td>
                </tr>
            </table>
        </div>
    </div>
</div>