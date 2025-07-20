<div class="container">
  <form id="professorForm">
    <input type="hidden" id="lecture_id">
    <input type="text" id="full_name" placeholder="Full Name" required>
    <input type="text" id="nic" placeholder="NIC" required>
    <input type="text" id="regi_num" placeholder="Registration Number" required>
    <input type="number" id="year" placeholder="Year" required>
    <input type="text" id="contact_num" placeholder="Contact Number" required>
    <input type="text" id="address" placeholder="Address" required>
    <input type="email" id="email" placeholder="Email" required>
    <select id="lecture_dep_id" required>
      <option value="">Select Department</option>
    </select>
    <input type="password" id="password" placeholder="Password" required>

    <button type="submit">Save</button>
  </form>

  <input type="text" id="searchBox" placeholder="Search by name or ID...">
  <div id="professorList"></div>
</div>