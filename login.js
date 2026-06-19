const loginForm = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerBtn");
const userInfo = document.getElementById("userInfo");
const userNameEl = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const editForm = document.getElementById("editForm");

// 登入
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("請輸入帳號與密碼");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    alert("登入成功！");
    localStorage.setItem("currentUser", JSON.stringify(user)); 
    showUserInfo(user);
  } else {
    alert("帳號或密碼錯誤，請重新輸入");
  }
});

// 註冊
registerBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("請輸入帳號與密碼");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some(u => u.username === username);

  if (exists) {
    alert("此帳號已存在，請使用其他帳號");
    return;
  }

  const newUser = { username, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("註冊成功，請重新登入");
});

// 登出
logoutBtn.addEventListener("click", () => {
  if (confirm("確定要登出嗎？")) {
    localStorage.removeItem("currentUser"); 
    location.reload();
  }
});

// 更新會員資料
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("請先登入");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex(u => u.username === currentUser.username);

  if (email) currentUser.email = email;
  if (newPassword) currentUser.password = newPassword;

  if (index !== -1) {
    users[index] = currentUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }

  alert("會員資料已更新！");
  showUserInfo(currentUser);
});

// 顯示會員資訊
function showUserInfo(user) {
  loginForm.classList.add("hidden");
  userInfo.classList.remove("hidden");
  userNameEl.textContent = user.username;

  // 顯示購買記錄
  const historyBody = document.getElementById("purchaseHistory");
  historyBody.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];

  if (history.length === 0) {
    historyBody.innerHTML = `<tr><td colspan="9" style="text-align:center;">目前沒有購買記錄</td></tr>`;
  } else {
    history.forEach((order, orderIndex) => {
      order.items.forEach(i => {
        const subtotal = (i.basePrice + (i.optionPrice || 0)) * i.qty;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${order.date}</td>
          <td><img src="${i.img || 'img/no-image.png'}" alt="${i.name}" style="width:60px;"> <br> ${i.name}</td>
          <td>${i.qty}</td>
          <td>NT$${subtotal.toLocaleString()}</td>
          <td>${order.customer?.name || "未填寫"}</td>
          <td>${order.customer?.phone || "未填寫"}</td>
          <td>${order.customer?.address || "未填寫"}</td>
          <td>
            <button onclick="reorder(${orderIndex})">再買一次</button>
            <button onclick="deleteOrder(${orderIndex})">刪除</button>
          </td>
        `;
        historyBody.appendChild(tr);
      });
    });
  }

  // 顯示評論 
  const myReviewsList = document.getElementById("myReviews"); 
  myReviewsList.innerHTML = ""; 
  history.forEach(order => { 
    order.items.forEach(i => { 
      const reviews = JSON.parse(localStorage.getItem("reviews_" + i.id)) || []; 
      reviews.forEach(r => { 
        const li = document.createElement("li"); 
        li.innerHTML = ` 
        <strong>${i.name}</strong> - ${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)} <br>${r.comment} `; 
        myReviewsList.appendChild(li); 
      }); 
    }); 
  });

  // 顯示信箱
  if (user.email) {
    document.getElementById("email").value = user.email;
  }
}

// 再買一次
function reorder(orderIndex) {
  const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
  const order = history[orderIndex];
  if (!order) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  order.items.forEach(item => cart.push(item));
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("已將此訂單商品重新加入購物車！");
  window.location.href = "cart.html";
}

// 刪除訂單
function deleteOrder(orderIndex) {
  const history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
  if (confirm("確定要刪除這筆訂單嗎？")) {
    history.splice(orderIndex, 1);
    localStorage.setItem("purchaseHistory", JSON.stringify(history));
    showUserInfo(JSON.parse(localStorage.getItem("currentUser")));
  }
}

// 頁面載入時檢查登入狀態
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) showUserInfo(currentUser);
});
