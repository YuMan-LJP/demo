// import { open } from 'sqlite3';

// //连接SQLite数据库
// const db = await open({
//     filename: './database.db'
// });

// console.log('数据库连接成功！');

// //创建数据库和表
// const createTable = `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT NOT NULL,
//     email TEXT NOT NULL,
//     password TEXT NOT NULL
//   );
// `;

// await db.exec(createTable);
// console.log('表创建成功！');

// //插入数据
// async function addUser(username, email, password) {
//     const insert = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
//     await db.run(insert, [username, email, password]);
//     console.log('用户添加成功！');
// }

// addUser('张三', 'zhangsan@example.com', '123qwe!Q');

// //查询数据
// async function getUsers() {
//     const query = 'SELECT * FROM users';
//     const result = await db.all(query);
//     console.log(result);
// }

// getUsers();

// //更新数据
// async function updateUser(id, username, email, password) {
//     const update = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
//     await db.run(update, [username, email, password, id]);
//     console.log('用户更新成功！');
// }

// updateUser(1, '李四', 'lisi@example.com', '123qwe!Q');

// //删除数据
// async function deleteUser(id) {
//     const deleteQuery = 'DELETE FROM users WHERE id = ?';
//     await db.run(deleteQuery, [id]);
//     console.log('用户删除成功！');
// }

// deleteUser(1);