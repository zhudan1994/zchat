var app = require('http').createServer();
var io = require('socket.io')(app);
var PORT = 8081;
/*定义用户数组*/
var users = [];

app.listen(PORT);
 
io.on('connection', socket => {
	// 是否是新用户
    var isNewUser = true;
    var currentUser = null;

	// console.log(socket);
	socket.on("login", data => {
	    for (let i = 0; i < users.length; i++) {
            if (users[i].username == data.username) {
          	    isNewUser = false;
          	    break;
            } else {
          	    isNewUser = true;
            }
	    }
        if (isNewUser) {
        	currentUser = data;
	        users.push(data);

	        socket.emit('loginSuccess', {username: data.username});
	        // type: 0 系统消息 1 本人消息 2他人消息
	        socket.broadcast.emit('receiveMessage', {type: 0, msg: '系统消息:' + data.username + '已加入群聊'});
	        io.sockets.emit('count', {count: users.length})

	    } else {
	    	socket.emit('loginError', {error: true, msg: '您已登录'})
	    }
	})
	socket.on('sendMessage', data => {
		socket.broadcast.emit('getOtherMsg', {type: 2, msg: data.msg, name: data.username});
	})
	socket.on('disconnect', () => {
		console.log(currentUser.username + '已断开连接');
		socket.broadcast.emit('receiveMessage', {type: 0, msg: '系统消息:' + currentUser.username + '已退出群聊'});
		users.map((user, index) => {
			if (user.username == currentUser.username) {
				users.splice(index, 1);
			}
		})
		io.sockets.emit('count', {count: users.length})
	})
})