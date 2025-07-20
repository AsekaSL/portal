<div class="managment-container">
    <div class="right-section">
        <div class="all-form-controller">
            <form action="" method="post" class="first-form-container">
                <div class="input-container">
                    <label for="full-name">Full Name</label>
                    <input type="text" name="fullName" id="full-name" required>
                </div>
                <div class="input-container">
                    <label for="department">Department</label>
                    <select name="department" id="department" required onchange="updateSubjects()">
                        <option>Select</option>
                        <option value="CS">Computer Science</option>
                        <option value="SE">Software Engineering</option>
                        <option value="IS">Ionformation Systems</option>
                    </select>
                </div>
                <div class="input-container">
                    <label for="subject">Subject</label>
                    <select name="subject" id="subject" required>
                        <option value="">Select</option>
                    </select>
                </div>
                <div class="input-container">
                    <label for="uniID">University ID Number</label>
                    <input type="text" name="uniID" id="uniID">
                </div>
                <div class="input-container">
                    <label for="designation">Designation</label>
                    <input type="text" name="designation" id="designation" required>
                </div>
                <div class="input-container">
                    <label for="contactNumber">Contact Number</label>
                    <input type="tel" name="contactNumber" id="contactNumber" required>
                </div>
                <div>
                    <label for="dateofjoin">Date of Join</label>
                    <input type="date" name="dateofjoin" id="dateofjoin" required>
                </div>

            </form>
            <form action="" method="post" class="second-form-container">

                <div class="input-container">
                    <label for="address">Address</label>
                    <input type="text" name="address" id="address">
                </div>
                <div>
                    <label for="email">Email address</label>
                    <input type="email" name="email" id="email" required>
                </div>
                <div>
                    <label for="nicNO">NIC Number</label>
                    <input type="text" name="nicNO" id="nicNO" required>
                </div>
                <div>
                    <label for="status">Status</label>
                    <select name="status" id="status" required>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Retired">Retired</option>
                        <option value="Resigned">Resigned</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
                <button>Update</button>
                <button>Delete</button>
            </form>
        </div>
        <div class="serach-container">
            <div class="serach-box">
                <input type="text" name="search" class="serach-bar" placeholder="Enter Professor Name">
                <img src="../../assets/admin/student-managment/search.png" class="search-img">
            </div>
        </div>
        <div class="table-container">
            <table border="1">
                <tr>
                    <th>University ID Number</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Subject</th>
                    <th>Email</th>
                </tr>
                <tr>
                    <td>00001</td>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <td>00002</td>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                </tr>
                <tr>
                    <td>00003</td>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                    <td>test</td>
                </tr>
            </table>
        </div>
    </div>
</div>